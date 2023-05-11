---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: zh
---

<div class="content">
<!-- The appearance of our current application is quite modest. In [exercise 0.2](/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6), the assignment was to go through Mozilla's [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).-->
我们当前应用的外观相当普通。在[练习0.2](/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6)中，任务是浏览Mozilla的[CSS教程](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)。

<!-- Let's take a look at how we can add styles to a React application. There are several different ways of doing this and we will take a look at the other methods later on. First, we will add CSS to our application the old-school way; in a single file without using a [CSS preprocessor](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (although this is not entirely true as we will learn later on).-->
让我们来看看我们如何给 React 应用程序添加样式。有几种不同的方法，我们稍后会看到其他方法。首先，我们将以旧式的方式向我们的应用程序添加 CSS；在没有使用[CSS 预处理器](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor)的情况下，在一个文件中（尽管这并不完全正确，因为我们稍后会学到）。

<!-- Let's add a new <i>index.css</i> file under the <i>src</i> directory and then add it to the application by importing it in the <i>index.js</i> file:-->
让我们在<i>src</i>目录下添加一个新的<i>index.css</i>文件，然后通过在<i>index.js</i>文件中导入它来将其添加到应用程序中：

```js
import './index.css'
```

<!-- Let's add the following CSS rule to the <i>index.css</i> file:-->
让我们把以下CSS规则添加到<i>index.css</i>文件中：

```css
h1 {
  color: green;
}
```

<!-- CSS rules comprise of <i>selectors</i> and <i>declarations</i>. The selector defines which elements the rule should be applied to. The selector above is <i>h1</i>, which will match all of the <i>h1</i> header tags in our application.-->
CSS 规则包括<i>选择器</i>和<i>声明</i>。选择器定义了该规则应用于哪些元素。上面的选择器是<i>h1</i>，它将匹配我们应用程序中的所有<i>h1</i>标题标签。

<!-- The declaration sets the _color_ property to the value <i>green</i>.-->
声明将 _颜色_ 属性设置为值 <i>绿色</i>。

<!-- One CSS rule can contain an arbitrary number of properties. Let's modify the previous rule to make the text cursive, by defining the font style as <i>italic</i>:-->
一条CSS规则可以包含任意数量的属性。让我们修改前面的规则，使文本为斜体，通过定义字体样式为<i>斜体</i>：

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```

<!-- There are many ways of matching elements by using [different types of CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).-->
有许多方法可以使用[不同类型的CSS选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)来匹配元素。

<!-- If we wanted to target, let's say, each one of the notes with our styles, we could use the selector <i>li</i>, as all of the notes are wrapped inside <i>li</i> tags:-->
如果我们想以我们的风格来针对每一个笔记，我们可以使用选择器<i>li</i>，因为所有的笔记都包裹在<i>li</i>标签内：

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
让我们在我们的样式表中添加下面的规则（由于我对优雅的网页设计的了解几乎为零，所以这些样式没有太多意义）：

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```

<!-- Using element types for defining CSS rules is slightly problematic. If our application contained other <i>li</i> tags, the same style rule would also be applied to them.-->
使用元素类型来定义CSS规则有点问题。如果我们的应用程序包含其他<i>li</i>标签，那么同样的样式规则也将应用于它们。

<!-- If we want to apply our style specifically to notes, then it is better to use [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).-->
如果我们想特别应用我们的样式到笔记，那么最好使用[类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)。

<!-- In regular HTML, classes are defined as the value of the <i>class</i> attribute:-->
在普通HTML中，类定义为<i>class</i>属性的值：

```html
<li class="note">some text...</li>
```

<!-- In React we have to use the [className](https://react.dev/learn#adding-styles) attribute instead of the class attribute. With this in mind, let's make the following changes to our <i>Note</i> component:-->
在React中，我们必须使用[className](https://react.dev/learn#adding-styles)属性而不是class属性。考虑到这一点，让我们对<i>Note</i>组件做出以下更改：

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
`.classname`语法定义类选择器：

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

<!-- If you now add other <i>li</i> elements to the application, they will not be affected by the style rule above.-->
如果你现在向应用程序添加其他<i>li</i>元素，它们不会受到上面样式规则的影响。

### Improved error message

<!-- We previously implemented the error message that was displayed when the user tried to toggle the importance of a deleted note with the <em>alert</em> method. Let's implement the error message as its own React component.-->
我们之前用<em>alert</em>方法实现了当用户试图切换已删除笔记重要性时显示的错误消息。让我们把错误消息实现为它自己的React组件。

<!-- The component is quite simple:-->
这个组件很简单：

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

<!-- If the value of the <em>message</em> prop is <em>null</em>, then nothing is rendered to the screen, and in other cases, the message gets rendered inside of a div element.-->
如果<em>message</em> 属性的值为<em>null</em>，那么什么也不会渲染到屏幕上，而在其他情况下，消息会被渲染到一个div元素内。

<!-- Let's add a new piece of state called <i>errorMessage</i> to the <i>App</i> component. Let's initialize it with some error message so that we can immediately test our component:-->
让我们在<i>App</i>组件中添加一个新的状态<i>errorMessage</i>。让我们用一些错误消息来初始化它，这样我们就可以立即测试我们的组件了。

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
然后让我们添加一条适合错误消息的样式规则：

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
现在我们准备添加显示错误消息的逻辑了。让我们改变一下<em>toggleImportanceOf</em>函数：

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
当发生错误时，我们会将描述性错误消息添加到<em>errorMessage</em>状态中。同时，我们开始计时器，该计时器将在五秒后将<em>errorMessage</em>状态设置为<em>null</em>。

<!-- The result looks like this:-->
结果看起来像这样：

![error removed from server screenshot from app](../../images/2/26e.png)

<!-- The code for the current state of our application can be found in the  <i>part2-7</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-7).-->
当前我们应用的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-7)上的<i>part2-7</i>分支找到。

### Inline styles

<!-- React also makes it possible to write styles directly in the code as so-called [inline styles](https://react-cn.github.io/react/tips/inline-styles.html).-->
React 还可以让开发者在代码中直接编写样式，这称为[内联样式](https://react-cn.github.io/react/tips/inline-styles.html)。

<!-- The idea behind defining inline styles is extremely simple. Any React component or element can be provided with a set of CSS properties as a JavaScript object through the [style](https://react.dev/reference/react-dom/components/common#applying-css-styles) attribute.-->
思想背后定义内联样式非常简单。通过[style](https://react.dev/reference/react-dom/components/common#applying-css-styles)属性，任何React组件或元素都可以通过一组CSS属性提供一个JavaScript对象。

<!-- CSS rules are defined slightly differently in JavaScript than in normal CSS files. Let's say that we wanted to give some element the color green and italic font that's 16 pixels in size. In CSS, it would look like this:-->
```
element {
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

<!-- But as a React inline-style object it would look like this:-->
但是作为一个React内联样式对象它看起来像这样：

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

<!-- Every CSS property is defined as a separate property of the JavaScript object. Numeric values for pixels can be simply defined as integers. One of the major differences compared to regular CSS, is that hyphenated (kebab case) CSS properties are written in camelCase.-->
每个CSS属性都定义为JavaScript对象的单独属性。像素的数值可以简单地定义为整数。与常规CSS相比，最大的不同之处在于，连字符（烤肉串式）CSS属性是以camelCase写的。

<!-- Next, we could add a "bottom block" to our application by creating a <i>Footer</i> component and defining the following inline styles for it:-->
接下来，我们可以通过创建一个<i>页脚</i>组件并为它定义以下内联样式来为我们的应用程序添加一个“底块”：

```js
// highlight-start
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}
// highlight-end

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

<!-- Inline styles come with certain limitations. For instance, so-called [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can''t be used straightforwardly.-->
inline style有一定的局限性。例如，所谓的[伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)不能直接使用。

<!-- Inline styles and some of the other ways of adding styles to React components go completely against the grain of old conventions. Traditionally, it has been considered best practice to entirely separate CSS from the content (HTML) and functionality (JavaScript). According to this older school of thought, the goal was to write CSS, HTML, and JavaScript into their separate files.-->
在线样式和其他一些为 React 组件添加样式的方式完全违反了旧的约定。传统上，最佳实践是完全将 CSS 与内容（HTML）和功能（JavaScript）分离开来。根据这种较旧的思想，目标是将 CSS、HTML 和 JavaScript 写入各自的文件中。

<!-- The philosophy of React is, in fact, the polar opposite of this. Since the separation of CSS, HTML, and JavaScript into separate files did not seem to scale well in larger applications, React bases the division of the application along the lines of its logical functional entities.-->
React 的哲学与此截然相反。由于将 CSS、HTML 和 JavaScript 分离到不同的档案在较大的应用程式中并未能有效的扩展，因此 React 将应用程式按照其逻辑功能实体进行划分。

<!-- The structural units that make up the application's functional entities are React components. A React component defines the HTML for structuring the content, the JavaScript functions for determining functionality, and also the component's styling; all in one place. This is to create individual components that are as independent and reusable as possible.-->
组成应用功能实体的结构单元是 React 组件。React 组件定义了用于结构化内容的 HTML、用于确定功能的 JavaScript 函数以及组件的样式；所有内容都放在一个地方。这是为了创建尽可能独立且可重用的单独组件。

<!-- The code of the final version of our application can be found in the  <i>part2-8</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-8).-->
最终版本的应用程序代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-8)上的<i>part2-8</i>分支中找到。

</div>

<div class="tasks">

<h3>Exercises 2.16.-2.17.</h3>

<h4>2.16: Phonebook step11</h4>

<!-- Use the [improved error message](/en/part2/adding_styles_to_react_app#improved-error-message) example from part 2 as a guide to show a notification that lasts for a few seconds after a successful operation is executed (a person is added or a number is changed):-->
使用[改进后的错误消息](/en/part2/adding_styles_to_react_app#improved-error-message)示例作为指导，在成功执行操作（添加人员或更改数字）后显示持续几秒钟的通知：
`在操作成功执行后，会显示持续几秒钟的通知，可以参考[改进后的错误消息](/en/part2/adding_styles_to_react_app#improved-error-message)示例。`

![successful green added screenshot](../../images/2/27e.png)

<h4>2.17*: Phonebook step12</h4>

<!-- Open your application in two browsers. **If you delete a person in browser 1** a short while before attempting to <i>change the person's phone number</i> in browser 2, you will get the following error message:-->
如果你在第一个浏览器中删除一个人，然后在第二个浏览器中尝试更改该人的电话号码，你会收到以下错误讯息：

![error message 404 not found when changing multiple browsers](../../images/2/29b.png)

<!-- Fix the issue according to the example shown in [promise and errors](/en/part2/altering_data_in_server#promises-and-errors) in part 2. Modify the example so that the user is shown a message when the operation does not succeed. The messages shown for successful and unsuccessful events should look different:-->
根据第2章节中[承诺和错误]（/en/part2/altering_data_in_server#promises-and-errors）的示例修复问题。 修改示例，以便在操作不成功时向用户显示消息。 成功和不成功事件显示的消息应该有所不同：

![error message shown on screen instead of in console feature add-on](../../images/2/28e.png)

<!-- **Note** that even if you handle the exception, the error message is printed to the console.-->
**注意** 即使你处理了异常，错误消息也会被打印到控制台。

</div>

<div class="content">

### Couple of important remarks

<!-- At the end of this part there are a few more challenging exercises. At this stage, you can skip the exercises if they are too much of a headache, we will come back to the same themes again later. The material is worth reading through in any case.-->
在本部分的末尾有一些更具挑战性的练习。此时，如果这些练习太头痛，你可以跳过它们，稍后我们会再次回到同一个主题。无论如何，这些材料值得一读。

<!-- We have done one thing in our app that is masking away a very typical source of error.-->
我们在应用中做了一件事，那就是掩盖了一个非常典型的错误来源。

<!-- We set the state _notes_ to have initial value of an empty array:-->
我们将状态_notes_设置为初始值为一个空数组：

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

<!-- This is a pretty natural initial value since the notes are a set, that is, there are many notes that the state will store.-->
这是一个相当自然的初始值，因为笔记是一组，也就是说，有许多笔记状态会存储。

<!-- If the state would be only saving "one thing", a more proper initial value would be _null_ denoting that there is <i>nothing</i> in the state at the start. Let us try what happens if we use this initial value:-->
如果状态只能保存“一件事”，更合适的初始值应该是_null_，表示状态一开始是<i>什么都没有</i>。让我们来看看使用这个初始值会发生什么：

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
}
```

<!-- The app breaks down:-->
应用程序分解如下：

![console typerror cannot read properties of null via map from App](../../images/2/31a.png)

<!-- The error message gives the reason and location for the error. The code that caused the problems is the following:-->
错误信息给出了错误的原因和位置。引起问题的代码是以下：

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

<!-- The error message is-->
"invalid syntax"

错误消息是"无效语法"

```bash
Cannot read properties of null (reading 'map')
```

<!-- The variable _notesToShow_ is first assigned the value of the state _notes_ and then the code tries to call method _map_ to an nonexisting object, that is, to _null_.-->
变量`notesToShow`首先被赋值为状态`notes`，然后代码试图调用方法`map`到一个不存在的对象，也就是`null`。

<!-- What is the reason for that?-->
**这是什么原因？**

<!-- The effect hook uses the function _setNotes_ to set _notes_ to have the notes that the backend is returning:-->
effect Hook 使用函数 _setNotes_ 来设置 _notes_，以获得后端返回的 notes：

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  // highlight-line
      })
  }, [])
```

<!-- However the problem is that the effect is executed only <i>after the first render</i>.-->
然而问题是，效果只在<i>第一次渲染之后</i>才会执行。
<!-- And because _notes_ has the initial value of null:-->
因为_notes_ 有初始值为null：

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
```

<!-- on the first render the following code gets executed-->
在第一次渲染时，执行以下代码

```js
notesToShow = notes

// ...

notesToShow.map(note => ...)
```

<!-- and this blows up the app since we can not call method _map_ of the value _null_.-->
因为我们无法调用值_null_的_map_方法，所以这把应用程序炸毁了。

<!-- When we set _notes_ to be initially an empty array, there is no error since it is allowed to call _map_ to an empty array.-->
当我们初始设置_notes_为一个空数组时，没有错误，因为允许对一个空数组调用_map_。

<!-- So, the initialization of the state "masked" the problem that is caused by the fact that the data is not yet fetched from the backend.-->
所以，状态的初始化“masked”由于数据尚未从后端获取而导致的问题。

<!-- Another way to circumvent the problem is to use <i>conditional rendering</i> and return null if the component state is not properly initialized:-->
另一种解决该问题的方法是使用<i>条件渲染</i>，如果组件状态没有正确初始化，则返回null：

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

<!-- So on the first render, nothing is rendered. When the notes arrive from the backend, the effect used function _setNotes_ to set the value of the state _notes_. This causes the component to be rendered again, and at the second render, the notes get rendered to the screen.-->
所以在第一次渲染时，什么都没有渲染。当来自后端的注释到达时，使用的效果函数_setNotes_设置状态_notes_的值。这导致组件被再次渲染，在第二次渲染时，注释被渲染到屏幕上。

<!-- The method based on conditional rendering is suitable in cases where it is impossible to define the state so that the initial rendering is possible.-->
条件渲染基础的方法适用于无法定义状态以使初始渲染可能的情况。

<!-- The other thing that we still need to have a closer look is the second parameter of the useEffect:-->
第二件事我们仍然需要仔细查看的是`useEffect`的第二个参数：

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, []) // highlight-line
```

<!-- The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).-->
<em>useEffect</em>的第二个参数用于[指定效果运行的频率](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)。
<!-- The principle is that the effect is always executed after the first render of the component <i>and</i> when the value of the second parameter changes.-->
原则是，组件首次渲染后就会执行效果， <i>并且</i> 当第二个参数的值发生变化时也会执行。

<!-- If the second parameter is an empty array <em>[]</em>, it's content never changes and the effect is only run after the first render of the component. This is exactly what we want when we are initializing the app state from the server.-->
如果第二个参数是一个空数组<em>[]</em>，它的内容永远不会改变，而且效果只会在组件的第一次渲染之后才会生效。当我们从服务器初始化应用程序状态时，这正是我们所希望的。

<!-- However, there are situations where we want to perform the effect at other times, e.g. when the state of the component changes in a particular way.-->
然而，有时我们希望在其他时候执行该效果，例如，当组件的状态以特定方式改变时。

<!-- Consider the following simple application for querying currency exchange rates from the [Exchange rate API](https://www.exchangerate-api.com/):-->
考虑以下用于从[Exchange rate API](https://www.exchangerate-api.com/)查询汇率的简单应用程序：

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
```

<!-- The user interface of the application has a form, in the input field of which the name of the desired currency is written. If the currency exists, the application renders the exchange rates of the currency to other currencies:-->
用户界面有一个表单，在输入框中输入所需货币的名称。如果该货币存在，应用程序将渲染该货币与其他货币的汇率：

![browser showing currency exchange rates with eur typed and console saying fetching exchange rates](../../images/2/32new.png)

<!-- The application sets the name of the currency entered to the form to the state _currency_ at the moment the button is pressed.-->
应用程序在按下按钮时，将输入的货币名称设置为当前状态的_货币_ 。

<!-- When the _currency_ gets a new value, the application fetches its exchange rates from the API in the effect function:-->
当货币获得新的值时，应用程序从API中获取其兑换率，在effect函数中：

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

<!-- The useEffect hook has now _[currency]_ as the second parameter. The effect function is therefore executed after the first render, and <i>always</i> after the table as its second parameter _[currency]_ changes. That is, when the state _currency_ gets a new value, the content of the table changes and the effect function is executed.-->
useEffect 钩子现在有 _[currency]_ 作为第二个参数。因此，效果函数在第一次渲染之后，以及表格作为其第二个参数 _[currency]_ 更改后<i>始终</i>执行。也就是说，当状态 _currency_ 获得一个新值时，表格的内容会发生改变，并且效果函数将被执行。

<!-- The effect has the following condition-->
效果具有以下条件：

```js
if (currency) {
  // exchange rates are fetched
}
```

<!-- which prevents requesting the exchange rates just after the first render when the variable _currency_ still has the initial value, i.e. a null value.-->
防止在变量_currency_仍具有初始值（即空值）的情况下在第一次渲染之后请求汇率。

<!-- So if the user writes e.g. <i>eur</i> in the search field, the application uses Axios to perform an HTTP GET request to the address <https://open.er-api.com/v6/latest/eur> and stores the response in the _rates_ state.-->
如果用户在搜索字段中输入<i>eur</i>，应用程序将使用Axios向地址<https://open.er-api.com/v6/latest/eur>发出HTTP GET请求，并将响应存储在_rates_状态中。

<!-- When the user then enters another value in the search field, e.g. <i>usd</i>, the effect function is executed again and the exchange rates of the new currency are requested from the API.-->
当用户在搜索框中输入另一个值，例如<i> usd </i>时，将再次执行效果函数，并从API请求新货币的汇率。

<!-- The way presented here for making API requests might seem a bit awkward.-->
这里提出的用于发出API请求的方式可能有点尴尬。
<!-- This particular application could have been made completely without using the useEffect, by making the API requests directly in the form submit handler function:-->
这个特定的应用程序可以完全不使用 useEffect，而是直接在表单提交处理函数中进行 API 请求。

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

<!-- However, there are situations where that technique would not work. For example, you <i>might</i> encounter one such a situation in the exercise 2.20 where the use of useEffect could provide a solution. Note that this depends quite much on the approach you selected, e.g. the model solution does not use this trick.-->
然而，有些情况下这种技术就不起作用了。例如，在练习2.20中，你<i>可能</i>会遇到这样一种情况，使用useEffect可以提供一种解决方案。请注意，这取决于你选择的方法，例如模型解决方案不使用这种技巧。

</div>

<div class="tasks">

<h3>Exercises 2.18.-2.20.</h3>

<h4>2.18* Data for countries, step1</h4>

<!-- The API [https://restcountries.com](https://restcountries.com) provides data for different countries in a machine-readable format, a so-called REST API.-->
[https://restcountries.com](https://restcountries.com)提供以机器可读格式（所谓的REST API）提供不同国家的数据。

<!-- Create an application, in which one can look at data from various countries. The application should probably get the data from the endpoint [all](https://restcountries.com/v3.1/all).-->
创建一个应用程序，其中可以查看来自各个国家的数据。 该应用程序可能会从端点[all]（https://restcountries.com/v3.1/all）获取数据。

<!-- The user interface is very simple. The country to be shown is found by typing a search query into the search field.-->
用户界面非常简单。通过在搜索字段中输入搜索查询即可找到要显示的国家。

<!-- If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific:-->
如果查询结果超过10个国家，则提示用户更加具体地查询：

![too many matches screenshot](../../images/2/19b1.png)

<!-- If there are ten or fewer countries, but more than one, then all countries matching the query are shown:-->
如果查询的国家数量不超过10个，但超过一个，则显示所有与查询匹配的国家：

![matching countries in a list screenshot](../../images/2/19b2.png)

<!-- When there is only one country matching the query, then the basic data of the country (eg. capital and area), its flag and the languages spoken are shown:-->
当只有一个国家与查询匹配时，则会显示该国家的基本数据（例如首都和面积）、旗帜以及使用的语言：

![flag and additional attributes screenshot](../../images/2/19c3.png)

<!-- **NB**: It is enough that your application works for most countries. Some countries, like <i>Sudan</i>, can be hard to support since the name of the country is part of the name of another country, <i>South Sudan</i>. You don''t need to worry about these edge cases.-->
**NB**：只要你的应用程序适用于大多数国家就足够了。有些国家，如<i>苏丹</i>，可能很难支持，因为这个国家的名字是另一个国家<i>南苏丹</i>的一部分。你不必担心这些边缘情况。

**NB**：只要你的应用程序适用于大多数国家就足够了。有些国家，如<i>苏丹</i>，可能很难支持，因为这个国家的名字是另一个国家<i>南苏丹</i>的一部分。你不必担心这些边缘情况。

<!-- **WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.-->
**警告**：除非你在现有的git仓库中创建应用程序，否则create-react-app将自动将你的项目转换为git仓库。**很可能你不想让每个项目都成为单独的仓库**，因此只需在应用程序的根目录中运行 _rm -rf .git_ 命令即可。

<h4>2.19*: Data for countries, step2</h4>

<!-- **There is still a lot to do in this part, so don''t get stuck on this exercise!**-->
**这部分还有很多要做的，所以不要停留在这个练习上！**

<!-- Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country:-->
改进前一个练习中的应用，使得当页面上显示多个国家的名称时，每个国家名称旁边都有一个按钮，按下该按钮可以显示该国家的视图：

![attach show buttons for each country feature](../../images/2/19b4.png)

<!-- In this exercise, it is also enough that your application works for most countries. Countries whose name appears in the name of another country, like <i>Sudan</i>, can be ignored.-->
在这个练习中，只要你的应用程序对大多数国家有效就足够了。可以忽略像<i>苏丹</i>这样以另一个国家名字命名的国家。

<h4>2.20*: Data for countries, step3</h4>

<!-- Add to the view showing the data of a single country, the weather report for the capital of that country. There are dozens of providers for weather data. One suggested API is [https://openweathermap.org](https://openweathermap.org). Note that it might take some minutes until a generated API key is valid.-->
将单个国家的数据视图中添加该国家首都的天气报告。有数十家天气数据提供商。建议使用[https://openweathermap.org](https://openweathermap.org) API。请注意，生成的API密钥可能需要几分钟才能生效。

![weather report added feature](../../images/2/19x.png)

<!-- If you use Open weather map, [here](https://openweathermap.org/weather-conditions#Icon-list) is the description for how to get weather icons.-->
如果您使用Open Weather Map，[这里](https://openweathermap.org/weather-conditions#Icon-list)是关于如何获取天气图标的描述。

<!-- **NB:** In some browsers (such as Firefox) the chosen API might send an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with _http://_. This issue can be fixed by completing the exercise using Chrome.-->
**火狐浏览器**可能会发送一个错误响应，表明不支持HTTPS加密，尽管请求URL以_http://_开头。要解决此问题，请使用Chrome完成练习。

<!-- **NB:** You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an [environment variable](https://create-react-app.dev/docs/adding-custom-environment-variables/) to save the key.-->
**注意：**几乎每个天气服务都需要使用API密钥。不要将API密钥保存到源控制中！也不要将API密钥硬编码到源代码中。而是使用[环境变量](https://create-react-app.dev/docs/adding-custom-environment-variables/)来保存密钥。

<!-- Assuming the api-key is <i>t0p53cr3t4p1k3yv4lu3</i>, when the application is started like so:-->
假设api-key为<i>t0p53cr3t4p1k3yv4lu3</i>，当应用程序以下面的方式启动时：

```bash
REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3 npm start // For Linux/macOS Bash
($env:REACT_APP_API_KEY="t0p53cr3t4p1k3yv4lu3") -and (npm start) // For Windows PowerShell
set "REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3" && npm start // For Windows cmd.exe
```

<!-- you can access the value of the key from the _process.env_ object:-->
你可以从_process.env_对象中访问键的值：

```js
const api_key = process.env.REACT_APP_API_KEY
// variable api_key has now the value set in startup
```

<!-- Note that if you created the application using _npx create-react-app ..._ and you want to use a different name for your environment variable then the environment variable name must still begin with *REACT\_APP_*. You can also use a `.env` file rather than defining it on the command line each time by creating a file entitled '.env' in the root of the project and adding the following.-->
注意，如果您使用_npx create-react-app ..._创建了应用程序，并且您想为环境变量使用不同的名称，则环境变量名称仍必须以*REACT\_APP_*开头。 您还可以使用` .env`文件而不是每次在命令行上定义它，方法是在项目根目录中创建一个名为'.env'的文件，并添加以下内容。

```
# .env

REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3
```

<!-- Note that you will need to restart the server to apply the changes.-->
注意，您需要重新启动服务器以应用更改。

<!-- This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本课程的最后一个练习。是时候将你的代码推送到GitHub，并将你完成的所有练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)上了。

</div>
