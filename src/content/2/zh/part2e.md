---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: zh
---

<div class="content">

<!-- The appearance of our current Notes application is quite modest. In [exercise 0.2](/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6), the assignment was to go through Mozilla's [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics). -->
我们目前的笔记应用的外观是相当简陋的。在[练习0.2](/zh/part0/web_应用的基础设施#练习-0-1-0-6)中，作业是阅读Mozilla的[CSS教程](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)。

<!-- Let's take a look at how we can add styles to a React application. There are several different ways of doing this and we will take a look at the other methods later on. First, we will add CSS to our application the old-school way; in a single file without using a [CSS preprocessor](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (although this is not entirely true as we will learn later on). -->
让我们看一下如何在React应用中添加样式。有几种不同的方法，我们将在后面看一下其他的方法。首先，我们将以传统的方式向我们的应用添加CSS；把CSS写入单个文件中，不使用[CSS预处理器](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor)（尽管我们将在后面学习到，实际上我们并非完全没有使用）。

<!-- Let's add a new <i>index.css</i> file under the <i>src</i> directory and then add it to the application by importing it in the <i>main.jsx</i> file: -->
让我们在<i>src</i>目录下添加一个新的<i>index.css</i>文件，然后在<i>main.jsx</i>文件中导入它来将其添加到应用：

```js
import './index.css'
```

<!-- Let's add the following CSS rule to the <i>index.css</i> file:-->
让我们在<i>index.css</i>文件中添加以下CSS规则：

```css
h1 {
  color: green;
}
```

<!-- CSS rules comprise of <i>selectors</i> and <i>declarations</i>. The selector defines which elements the rule should be applied to. The selector above is <i>h1</i>, which will match all of the <i>h1</i> header tags in our application.-->
CSS规则包括<i>选择器</i>和<i>声明</i>。选择器定义了规则应该应用于哪些元素。上面的选择器是<i>h1</i>，因此选择器将匹配我们应用中所有<i>h1</i>标题的标签。

<!-- The declaration sets the _color_ property to the value <i>green</i>.-->
声明将_color_属性设为值<i>green</i>。

<!-- One CSS rule can contain an arbitrary number of properties. Let's modify the previous rule to make the text cursive, by defining the font style as <i>italic</i>:-->
一条CSS规则可以包含任意数量的属性。让我们修改前面的规则，通过定义字体样式为<i>italic</i>，把文字变成草体。

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```


<!-- There are many ways of matching elements by using [different types of CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).-->
通过使用[不同类型的CSS选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)，可以实现许多匹配元素的方法。

<!-- If we wanted to target, let's say, each one of the notes with our styles, we could use the selector <i>li</i>, as all of the notes are wrapped inside <i>li</i> tags:-->
如果我们想把我们的样式应用于，比方说，每一条笔记，我们可以使用选择器<i>li</i>，因为所有的笔记都被包裹在<i>li</i>标签里：

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important';

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

<!-- Let's add the following rule to our style sheet (since my knowledge of elegant web design is close to zero, the styles don't make much sense):-->
让我们在我们的样式表中加入以下规则（因为我对优雅的网页设计的知识接近于零，所以这些样式并没有什么意义）：

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```

<!-- Using element types for defining CSS rules is slightly problematic. If our application contained other <i>li</i> tags, the same style rule would also be applied to them.-->
使用元素类型来定义CSS规则是有点问题的。如果我们的应用包含其他的<i>li</i>标签，它们也会应用同样的样式规则。

<!-- If we want to apply our style specifically to notes, then it is better to use [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).-->
如果我们想把我们的样式专门应用于笔记，那么最好使用[类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)。

<!-- In regular HTML, classes are defined as the value of the <i>class</i> attribute:-->
在通常的HTML中，类的定义是<i>class</i>属性的值：

```html
<li class="note">some text...</li>
```

<!-- In React we have to use the [className](https://react.dev/learn#adding-styles) attribute instead of the class attribute. With this in mind, let's make the following changes to our <i>Note</i> component: -->
在React中，我们必须使用[className](https://react.dev/learn#adding-styles)属性而不是class属性。考虑到这一点，让我们对我们的<i>Note</i>组件做如下修改：

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important';

  return (
    <li className='note'> // highlight-line
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```


<!-- Class selectors are defined with the _.classname_ syntax:-->
类选择器是用_.classname_语法定义的：

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

<!-- If you now add other <i>li</i> elements to the application, they will not be affected by the style rule above.-->
现在如果你在应用中添加其他<i>li</i>元素，它们就不会受上述样式规则的影响了。

<!-- ### Improved error message -->
### 改进错误信息

<!-- We previously implemented the error message that was displayed when the user tried to toggle the importance of a deleted note with the <em>alert</em> method. Let's implement the error message as its own React component.-->
我们之前用<em>alert</em>方法实现了当用户试图切换已删除笔记的重要性时显示的错误信息。让我们把这个错误信息实现为它自己的React组件。

<!-- The component is quite simple:-->
组件很简单：

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}
```

<!-- If the value of the <em>message</em> prop is <em>null</em>, then nothing is rendered to the screen, and in other cases the message gets rendered inside of a div element.-->
如果<em>message</em> props的值是<em>null</em>，那么就不会在屏幕上渲染信息，而在其他情况下，会把信息渲染到一个div元素中。

<!-- Let's add a new piece of state called <i>errorMessage</i> to the <i>App</i> component. Let's initialize it with some error message so that we can immediately test our component:-->
让我们向<i>App</i>组件中添加一个叫做<i>errorMessage</i>的新状态片段。让我们用一些错误信息来初始化它，这样我们就可以立即测试我们的组件：

```js
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...') // highlight-line

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      // ...
    </div>
  )
}
```

<!-- Then let's add a style rule that suits an error message:-->
然后让我们添加一个适合错误信息的样式规则：

```css
.error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

<!-- Now we are ready to add the logic for displaying the error message. Let's change the <em>toggleImportanceOf</em> function in the following way:-->
现在我们准备添加显示错误信息的逻辑。让我们将<em>toggleImportanceOf</em>函数改成：

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // highlight-start
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // highlight-end
        setNotes(notes.filter(n => n.id !== id))
      })
  }
```

<!-- When the error occurs we add a descriptive error message to the <em>errorMessage</em> state. At the same time, we start a timer, that will set the <em>errorMessage</em> state to <em>null</em> after five seconds.-->
当发生错误时，我们把错误信息的描述添加到<em>errorMessage</em>状态中。同时，我们启动一个定时器，在五秒后将<em>errorMessage</em>状态设为<em>null</em>。

<!-- The result looks like this:-->
结果看起来是这样的：

![](../../images/2/26e.png)

<!-- The code for the current state of our application can be found in the  <i>part2-7</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-7). -->
我们应用当前状态的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-7)上的<i>part2-7</i>分支找到。

<!-- ### Inline styles -->
### 内联样式

<!-- React also makes it possible to write styles directly in the code as so-called [inline styles](https://react-cn.github.io/react/tips/inline-styles.html).-->
在React中也可以直接在代码中编写样式，即所谓的[内联样式](https://react-cn.github.io/react/tips/inline-styles.html)。

<!-- The idea behind defining inline styles is extremely simple. Any React component or element can be provided with a set of CSS properties as a JavaScript object through the [style](https://react.dev/reference/react-dom/components/common#applying-css-styles) attribute. -->
定义内联样式的想法非常简单。可以将一组CSS属性作为JavaScript对象通过[style](https://reactjs.org/docs/dom-elements.html#style)属性提供给任何React组件或元素。

<!-- CSS rules are defined slightly differently in JavaScript than in normal CSS files. Let's say that we wanted to give some element the color green and italic font. In CSS, it would look like this: -->
JavaScript中的CSS规则定义与普通的CSS文件略有不同。比方说，我们想给某个元素加上绿色和斜体。CSS中会是这样的：

```css
{
  color: green;
  font-style: italic;
}
```

<!-- But as a React inline style object it would look like this:-->
但定义成React内联样式的对象是这样的：

```js
{
  color: 'green',
  fontStyle: 'italic'
}
```

<!-- Every CSS property is defined as a separate property of the JavaScript object. Numeric values for pixels can be simply defined as integers. One of the major differences compared to regular CSS, is that hyphenated (kebab case) CSS properties are written in camelCase.-->
每个CSS属性都被定义为JavaScript对象的一个单独的属性。像素的数字值可以简单地用整数定义。和普通CSS相比的一个主要区别是，CSS属性是用连字符*-*连接的（烤串命名法），JavaScript对象的属性是用驼峰式命名法（camelCase）的。

<!-- Let's add a footer component, <i>Footer</i>, to our application and define inline styles for it. The component is defined in the file _components/Footer.jsx_ and used in the file _App.jsx_ as follows: -->
让我们向我们的应用中添加一个脚注组件，<i>Footer</i>，并为其定义内联样式。组件像下面定义在文件_components/Footer.jsx_中，并在_App.jsx_文件中使用：

```js
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic'
  }

  return (
    <div style={footerStyle}>
      <br />
      <p>
        Note app, Department of Computer Science, University of Helsinki 2025
      </p>
    </div>
  )
}

export default Footer
```

```js
import { useState, useEffect } from 'react'
import Footer from './components/Footer' // highlight-line
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // ...

      <Footer /> // highlight-line
    </div>
  )
}
```

<!-- Inline styles come with certain limitations. For instance, so-called [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can't be used straightforwardly.-->
内联样式有某些限制。例如，不能直接使用所谓的[伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)。

<!-- Inline styles and some of the other ways of adding styles to React components go completely against the grain of old conventions. Traditionally, it has been considered best practice to entirely separate CSS from the content (HTML) and functionality (JavaScript). According to this older school of thought, the goal was to write CSS, HTML, and JavaScript into their separate files.-->
内联样式以及一些其他为React组件添加样式的方法完全违背了旧的惯例。传统上，人们认为最好的做法是将CSS与内容（HTML）和功能（JavaScript）完全分开。根据这一传统的思想，我们要将CSS、HTML和JavaScript分开写成单独的文件。

<!-- The philosophy of React is, in fact, the polar opposite of this. Since the separation of CSS, HTML, and JavaScript into separate files did not seem to scale well in larger applications, React bases the division of the application along the lines of its logical functional entities.-->
React的哲学事实上与此截然相反。由于将CSS、HTML和JavaScript分离到不同的文件中，似乎会使大型应用不能很好地扩展，所以React将应用的划分建立在其逻辑功能实体的基础上。

<!-- The structural units that make up the application's functional entities are React components. A React component defines the HTML for structuring the content, the JavaScript functions for determining functionality, and also the component's styling; all in one place. This is to create individual components that are as independent and reusable as possible.-->
构成应用功能实体的结构单元是React组件。一个React组件定义了构造内容的HTML，决定功能的JavaScript函数，以及组件的样式；所有内容都在一个地方定义。这是为了创建尽可能独立和可重复使用的单个组件。

<!-- The code of the final version of our application can be found in the  <i>part2-8</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-8). -->
我们应用的最终版本的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-8)上的<i>part2-8</i>分支中找到。

</div>

<div class="tasks">

<!-- <h3>Exercises 2.16.-2.17.</h3> -->
<h3>练习 2.16.~2.17.</h3>

<!-- <h4>2.16: Phonebook step 11</h4> -->
<h4>2.16：电话簿 第11步</h4>

<!-- Use the [improved error message](/en/part2/adding_styles_to_react_app#improved-error-message) example from part 2 as a guide to show a notification that lasts for a few seconds after a successful operation is executed (a person is added or a number is changed):-->
参考第2章节中[改进错误信息](/zh/part2/给_react应用加点样式#改进错误信息)的例子，在执行了成功的操作（添加了一个人或更改了一个号码）后，显示一个持续几秒钟的通知：

![](../../images/2/27e.png)

<!-- <h4>2.17*: Phonebook step 12</h4> -->
<h4>2.17*：电话簿 第12步</h4>

<!-- Open your application in two browsers. **If you delete a person in browser 1** a short while before attempting to <i>change the person's phone number</i> in browser 2, you will get the following error message:-->
在两个浏览器中打开你的应用。**如果你在浏览器1中删除一个人**，然后又在浏览器2中尝试<i>更改这个人的电话号码</i>，你会得到以下错误信息：

![](../../images/2/29b.png)

<!-- Fix the issue according to the example shown in [promise and errors](/en/part2/altering_data_in_server#promises-and-errors) in part 2. Modify the example so that the user is shown a message when the operation does not succeed. The messages shown for successful and unsuccessful events should look different:-->
按照第2章节中[Promise和错误](/zh/part2/修改服务端的数据#promise和错误)所示的例子来修复这个问题。修改这个例子，使用户在操作不成功时显示一条信息。操作不成功时显示的信息应与操作成功时的看起来不同：

![](../../images/2/28e.png)

<!-- **Note** that even if you handle the exception, the first "404" error message is still printed to the console. But you should not see "Uncaught (in promise) Error". -->
**注意**即使你处理了异常，第一个“404”的错误信息也会打印到控制台。但你应该看不到“Uncaught (in promise) Error”了。

</div>

<div class="content">

### 一些重要的注意事项

<!-- At the end of this part there are a few more challenging exercises. At this stage, you can skip the exercises if they are too much of a headache, we will come back to the same themes again later. The material is worth reading through in any case. -->
在本部分的最后，有一些更具挑战性的练习。如果这些练习让你感到头疼，可以先跳过，我们后面会再次回到这些主题。无论如何，这部分的材料都值得阅读。

<!-- We have done one thing in our app that is masking away a very typical source of error. -->
在我们的应用中，我们做的一件事掩盖了一个非常典型的错误来源。

<!-- We set the state _notes_ to have initial value of an empty array: -->
我们将状态_notes_的初始值设为一个空数组：

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

<!-- This is a pretty natural initial value since the notes are a set, that is, there are many notes that the state will store. -->
这是一个非常自然的初始值，因为_notes_是一组笔记，也就是说，状态将存储许多笔记。

<!-- If the state were only saving "one thing", a more appropriate initial value would be _null_ denoting that there is <i>nothing</i> in the state at the start. Let's see what happens if we use this initial value: -->
如果状态只保存“一个东西”，更合适的初始值是 _null_，表示一开始状态中<i>什么都没有</i>。让我们看看如果使用_null_为初始值会发生什么：

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
}
```

<!-- The app breaks down: -->
应用崩溃了：

![](../../images/2/31a.png)

<!-- The error message gives the reason and location for the error. The code that caused the problems is the following: -->
错误信息给出了错误的原因和位置。导致问题的代码如下：

```js
  // notesToShow gets the value of notes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  // ...

  {notesToShow.map(note =>  // highlight-line
    <Note key={note.id} note={note} />
  )}
```

<!-- The error message is -->
错误信息是

```bash
Cannot read properties of null (reading 'map')
```

<!-- The variable _notesToShow_ is first assigned the value of the state _notes_ and then the code tries to call method _map_ to a nonexisting object, that is, to _null_. -->
变量_notesToShow_首先被赋值为状态_notes_的值，然后代码尝试对一个不存在的对象，也就是_null_，调用_map_方法。

<!-- What is the reason for that? -->
这是什么原因呢？

<!-- The effect hook uses the function _setNotes_ to set _notes_ to have the notes that the backend is returning: -->
Effect Hook使用函数_setNotes_将_notes_设为后端返回的笔记：

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  // highlight-line
      })
  }, [])
```

<!-- However the problem is that the effect is executed only <i>after the first render</i>. -->
然而，问题在于Effect只在<i>第一次渲染之后</i>执行。
<!-- And because _notes_ has the initial value of null: -->
并且因为_notes_的初始值是null：

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
```

<!-- on the first render the following code gets executed: -->
在第一次渲染时，以下代码被执行：

```js
notesToShow = notes

// ...

notesToShow.map(note => ...)
```

<!-- and this blows up the app since we can not call method _map_ of the value _null_. -->
这导致应用崩溃，因为我们不能对_null_值调用_map_方法。

<!-- When we set _notes_ to be initially an empty array, there is no error since it is allowed to call _map_ to an empty array. -->
当我们将_notes_的初始值设为空数组时，就不会出现错误，因为空数组是可以调用_map_的。

<!-- So, the initialization of the state "masked" the problem that is caused by the fact that the data is not yet fetched from the backend. -->
因此，状态的初始化“掩盖”了由于数据尚未从后端获取而导致的问题。

<!-- Another way to circumvent the problem is to use <i>conditional rendering</i> and return null if the component state is not properly initialized: -->
另一种解决问题的方法是使用<i>条件渲染</i>，如果组件状态未被正确初始化，则返回null：

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line
  // ...

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // do not render anything if notes is still null
  // highlight-start
  if (!notes) {
    return null
  }
  // highlight-end

  // ...
}
```

<!-- So on the first render, nothing is rendered. When the notes arrive from the backend, the effect used function _setNotes_ to set the value of the state _notes_. This causes the component to be rendered again, and at the second render, the notes get rendered to the screen. -->
因此，在第一次渲染时，不会渲染任何内容。当笔记从后端到达时，Effect使用函数_setNotes_来设状态_notes_的值。这会导致组件再次渲染，于是在第二次渲染时，笔记会被渲染到屏幕上。

<!-- The method based on conditional rendering is suitable in cases where it is impossible to define the state so that the initial rendering is possible. -->
基于条件渲染的方法适用于无法定义状态以致无法首次渲染的情况。

<!-- The other thing that we still need to have a closer look at is the second parameter of the useEffect: -->
另一件我们还需要进一步观察的事情是useEffect的第二个参数：

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, []) // highlight-line
```

<!-- The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://react.dev/reference/react/useEffect#parameters). The principle is that the effect is always executed after the first render of the component <i>and</i> when the value of the second parameter changes. -->
<em>useEffect</em>的第二个参数用于[指定Effect的运行频率](https://react.dev/reference/react/useEffect#parameters)。原则是Effect总是在组件第一次渲染后<i>以及</i>第二个参数的值发生变化时执行。

<!-- If the second parameter is an empty array <em>[]</em>, its content never changes and the effect is only run after the first render of the component. This is exactly what we want when we are initializing the app state from the server. -->
如果第二个参数是一个空数组<em>[]</em>，它的内容永远不会改变，于是Effect只会在组件第一次渲染后运行。这正是我们在从服务端初始化应用状态时所需要的。

<!-- However, there are situations where we want to perform the effect at other times, e.g. when the state of the component changes in a particular way. -->
然而，有些情况下我们还希望在其他时候执行 Effect，例如当组件的状态以特定方式发生变化时。

<!-- Consider the following simple application for querying currency exchange rates from the [Exchange rate API](https://www.exchangerate-api.com/): -->
考虑以下用于从[Exchange rate API](https://www.exchangerate-api.com/)查询货币汇率的简单应用：

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [rates, setRates] = useState({})
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        currency: <input value={value} onChange={handleChange} />
        <button type="submit">exchange rate</button>
      </form>
      <pre>
        {JSON.stringify(rates, null, 2)}
      </pre>
    </div>
  )
}

export default App
```

<!-- The user interface of the application has a form, in the input field of which the name of the desired currency is written. If the currency exists, the application renders the exchange rates of the currency to other currencies: -->
该应用的用户界面有一个表单，用户可以在输入框中输入想要查询的货币的名称。如果货币存在，应用会渲染该货币和其他货币的汇率：

![](../../images/2/32new.png)

<!-- The application sets the name of the currency entered to the form to the state _currency_ at the moment the button is pressed. -->
在按下按钮时，应用将表单中输入的货币名称设为状态_currency_。

<!-- When the _currency_ gets a new value, the application fetches its exchange rates from the API in the effect function: -->
当_currency_得到新值时，应用会在Effect函数中从API获取其汇率：

```js
const App = () => {
  // ...
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency]) // highlight-line
  // ...
}
```

<!-- The useEffect hook now has _[currency]_ as the second parameter. The effect function is therefore executed after the first render, and <i>always</i> after the table as its second parameter _[currency]_ changes. That is, when the state _currency_ gets a new value, the content of the table changes and the effect function is executed. -->
现在useEffect Hook的第二个参数是_[currency]_。因此，Effect函数会在第一次渲染后执行，并且<i>总是</i>在表发生变化，也就是函数的第二个参数_[currency]_的值发生变化时执行。也就是说，每当状态_currency_获得新值时，表的内容发生变化，Effect函数被执行。

<!-- It is natural to choose _null_ as the initial value for the variable _currency_, because _currency_ represents a single item. The initial value _null_ indicates that there is nothing in the state yet, and it is also easy to check with a simple if statement whether a value has been assigned to the variable. The effect has the following condition -->
选择_null_作为变量_currency_的初始值是很自然的，因为_currency_只代表一件物品。初始值_null_表示状态中尚无任何内容，并且可以简单通过if语句检查变量是否已被赋值。Effect有以下条件：

```js
if (currency) {
  // exchange rates are fetched
}
```

<!-- which prevents requesting the exchange rates just after the first render when the variable _currency_ still has the initial value, i.e. a _null_ value. -->
这可以防止首次渲染后在变量_currency_仍然是初始值_null_的时候立即请求汇率。

<!-- So if the user writes e.g. <i>eur</i> in the search field, the application uses Axios to perform an HTTP GET request to the address <https://open.er-api.com/v6/latest/eur> and stores the response in the _rates_ state. -->
所以如果用户在搜索框中输入例如<i>eur</i>，应用会使用axios向地址<https://open.er-api.com/v6/latest/eur>发送HTTP GET请求，并将响应存储在_rates_状态中。

<!-- When the user then enters another value in the search field, e.g. <i>usd</i>, the effect function is executed again and the exchange rates of the new currency are requested from the API. -->
当用户随后在搜索框中输入另一个值，例如<i>usd</i>，Effect函数会再次执行，并通过API请求新货币的汇率。

<!-- The way presented here for making API requests might seem a bit awkward. -->
这里展示的进行API请求的方法可能看起来有点不方便。
<!-- This particular application could have been made completely without using the useEffect, by making the API requests directly in the form submit handler function: -->
这个特定的应用完全可以不使用useEffect，而直接在表单的提交处理函数中进行API请求：

```js
  const onSearch = (event) => {
    event.preventDefault()
    axios
      .get(`https://open.er-api.com/v6/latest/${value}`)
      .then(response => {
        setRates(response.data.rates)
      })
  }
```

<!-- However, there are situations where that technique would not work. For example, you <i>might</i> encounter one such a situation in the exercise 2.20 where the use of useEffect could provide a solution. Note that this depends quite much on the approach you selected, e.g. the model solution does not use this trick. -->
然而在有些情况下，这种方法是行不通的。例如，你<i>可能</i>会在练习2.20中遇到这种行不通的情况，此时可以使用useEffect来解决。注意这在很大程度上取决于你选择的方法，例如，model solution就没有使用这一技巧。

</div>

<div class="tasks">

<!-- <h3>Exercises 2.18.-2.20.</h3> -->
<h3>练习2.18.~2.20.</h3>

<!-- <h4>2.18* Data for countries, step 1</h4> -->
<h4>2.18*：各国数据，第1步</h4>

<!-- At [https://studies.cs.helsinki.fi/restcountries/](https://studies.cs.helsinki.fi/restcountries/) you can find a service that offers a lot of information related to different countries in a so-called machine-readable format via the REST API. Make an application that allows you to view information from different countries. -->
你可以在[https://studies.cs.helsinki.fi/restcountries/](https://studies.cs.helsinki.fi/restcountries/)找到一个服务，它通过REST API以所谓机器可读的格式提供关于不同国家的许多信息。做一个可以让你查看不同国家信息的应用。

<!-- The user interface is very simple. The country to be shown is found by typing a search query into the search field.-->
用户界面非常简单。通过在搜索框里输入一个搜索查询来找到要显示的国家。

<!-- If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific:-->
如果有太多（超过10个）国家符合查询条件，则提示用户查得再具体些：

![](../../images/2/19b1.png)

<!-- If there are ten or fewer countries, but more than one, then all countries matching the query are shown:-->
如果有十个及以下，但超过一个国家，那么就会显示所有符合查询条件的国家：

![](../../images/2/19b2.png)

<!-- When there is only one country matching the query, then the basic data of the country (eg. capital and area), its flag and the languages spoken there, are shown:-->
如果只有一个国家符合查询条件，则显示该国的基本数据（如首都和面积）、国旗和使用的语言：

![](../../images/2/19c3.png)

<!-- **NB**: It is enough that your application works for most of the countries. Some countries, like <i>Sudan</i>, can be hard to support, since the name of the country is part of the name of another country, <i>South Sudan</i>. You don't need to worry about these edge cases.-->
**注意**：你的应用对大多数国家都有效就可以了。有些国家，如<i>苏丹（Sudan）</i>，可能很难支持，因为这个国家的名字是另一个国家<i>南苏丹（South Sudan）</i>名字的一部分。你不需要担心这些边缘情况。

<!-- <h4>2.19*: Data for countries, step 2</h4> -->
<h4>2.19*：各国数据，第2步</h4>

<!-- **There is still a lot to do in this part, so don't get stuck on this exercise!**-->
**这部分还有很多事情要做，所以不要在这道练习上卡住！**

<!-- Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country:-->
改进前一道练习中的应用，使得当页面上显示多个国家的名字时，在国名旁边有一个按钮，按下后会展示该国家：

![](../../images/2/19b4.png)

<!-- In this exercise it is also enough that your application works for most of the countries. Countries whose name appears in the name of another country, like <i>Sudan</i>, can be ignored.-->
在这道练习中，也只要让你的应用对大多数国家都有效就足够了。可以忽略那些名字出现在另一个国家名字中的国家，如<i>苏丹</i>。

<!-- <h4>2.20*: Data for countries, step 3</h4> -->
<h4>2.20*：各国数据，第3步</h4>

<!-- Add to the view showing the data of a single country, the weather report for the capital of that country. There are dozens of providers for weather data. One suggested API is [https://openweathermap.org](https://openweathermap.org). Note that it might take some minutes until a generated API key is valid. -->
在显示单个国家数据的界面中，添加该国首都的天气预报。有许多提供天气数据的API。一个建议的API是[https://openweathermap.org](https://openweathermap.org)。注意生成的API密钥可能需要过一段时间才会有效。

![](../../images/2/19x.png)

<!-- If you use Open weather map, [here](https://openweathermap.org/weather-conditions#Icon-list) is the description how to get weather icons.-->
如果你使用Open weather map，[这里](https://openweathermap.org/weather-conditions#Icon-list)描述了如何获取天气图标。

<!-- **NB:** In some browsers (such as Firefox) the chosen API might send an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with _http://_. This issue can be fixed by completing the exercise using Chrome.-->
**注意：**在某些浏览器（比如Firefox）中，你选用的API可能会发送一个错误响应，这表明不支持HTTPS加密，尽管请求的URL以_http://_ 开头。这个问题可以通过使用Chrome完成练习来解决。

<!-- **NB:** You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an [environment variable](https://vitejs.dev/guide/env-and-mode.html) to save the key in this exercise. In real-life applications, it's considered insecure sending these keys directly from the browser, as anyone who can open the dev console would be able to intercept your keys! We will focus on implementing a separate backend in the next part of the course. -->
**注意：**几乎所有的气象服务都需要你有api密钥才能使用。不要把api密钥保存到源代码管理（如git）中！也不要在你的源代码中硬编码api密钥。而是用[环境变量](https://vitejs.dev/guide/env-and-mode.html)来保存这道练习中使用的密钥。在实际的应用中，直接在浏览器中发送这些密钥是不安全的，因为任何能打开开发者控制台的人都可以窃取你的密钥！我们将在课程的下一章节集中实现独立的后端。

<!-- Assuming the api-key is <i>54l41n3n4v41m34rv0</i>, when the application is started like so: -->
假设api密钥是<i>54l41n3n4v41m34rv0</i>，这么启动应用后：

```bash
export VITE_SOME_KEY=54l41n3n4v41m34rv0 && npm run dev // For Linux/macOS Bash
($env:VITE_SOME_KEY="54l41n3n4v41m34rv0") -and (npm run dev) // For Windows PowerShell
set "VITE_SOME_KEY=54l41n3n4v41m34rv0" && npm run dev // For Windows cmd.exe
```

<!-- you can access the value of the key from the _import.meta.env_ object: -->
你就可以通过_import.meta.env_对象来访问密钥的值：

```js
const api_key = import.meta.env.VITE_SOME_KEY
// variable api_key now has the value set in startup
```

<!-- **NB:** To prevent accidentally leaking environment variables to the client, only variables prefixed with VITE_ are exposed to Vite. -->
**注意：**为了防止环境变量意外泄露到客户端，只有以VITE_开头的变量才对Vite可见。

<!-- Also remember that if you make changes to environment variables, you need to restart the development server for the changes to take effect. -->
同时记得如果你更改了环境变量，你需要重启开发服务端来使更改生效。

<!-- This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是课程中这一章节的最后一道练习。是时候把你的代码推送到GitHub，并在[练习上交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中标记你所有完成的练习了。

</div>
