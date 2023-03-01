---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: zh
---

<div class="content">


<!-- The appearance of our current application is quite modest. In [exercise 0.2](/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6), the assignment was to go through Mozilla's [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).-->
 我们目前的应用的外观是相当简陋的。在[练习0.2](/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6)中，任务是通过Mozilla的[CSS教程](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)。

<!-- Before we move onto the next part, let's take a look at how we can add styles to a React application. There are several different ways of doing this and we will take a look at the other methods later on. First, we will add CSS to our application the old-school way; in a single file without using a [CSS preprocessor](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (although this is not entirely true as we will learn later on).-->
 在我们进入下一部分之前，让我们看一下如何在React应用中添加样式。有几种不同的方法，我们将在后面看一下其他的方法。首先，我们将以老式的方式向我们的应用添加CSS；在一个文件中，不使用[CSS预处理器](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor)（尽管这并不完全正确，我们将在后面学习）。

<!-- Let's add a new <i>index.css</i> file under the <i>src</i> directory and then add it to the application by importing it in the <i>index.js</i> file:-->
 让我们在<i>src</i>目录下添加一个新的<i>index.css</i>文件，然后通过在<i>index.js</i>文件中导入它来添加到应用。

```js
import './index.css'
```

<!-- Let's add the following CSS rule to the <i>index.css</i> file:-->
 让我们在<i>index.css</i>文件中添加以下CSS规则。

```css
h1 {
  color: green;
}
```

<!-- **Note:** when the content of the file <i>index.css</i> changes, React might not notice that automatically, so you may need to refresh the browser to see your changes!-->
 **注意：**当文件<i>index.css</i>的内容发生变化时，React可能不会自动注意到，所以你可能需要刷新浏览器才能看到你的变化!

<!-- CSS rules comprise of <i>selectors</i> and <i>declarations</i>. The selector defines which elements the rule should be applied to. The selector above is <i>h1</i>, which will match all of the <i>h1</i> header tags in our application.-->
 CSS规则由<i>选择器</i>和<i>声明</i>组成。选择器定义了该规则应该应用于哪些元素。上面的选择器是<i>h1</i>，它将匹配我们应用中所有的<i>h1</i>头标签。

<!-- The declaration sets the _color_ property to the value <i>green</i>.-->
 该声明将_color_属性设置为<i>green</i>值。

<!-- One CSS rule can contain an arbitrary number of properties. Let's modify the previous rule to make the text cursive, by defining the font style as <i>italic</i>:-->
一条CSS规则可以包含任意数量的属性。让我们修改前面的规则，通过定义字体样式为<i>italic</i>，使文字变成草书。

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```


<!-- There are many ways of matching elements by using [different types of CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).-->
 通过使用[不同类型的CSS选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)，有许多匹配元素的方法。


<!-- If we wanted to target, let's say, each one of the notes with our styles, we could use the selector <i>li</i>, as all of the notes are wrapped inside <i>li</i> tags:-->
 如果我们想用我们的样式针对，比方说，每一个笔记，我们可以使用选择器<i>li</i>，因为所有的笔记都被包裹在<i>li</i>标签里。

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
 让我们在我们的样式表中加入以下规则（因为我对优雅的网页设计的知识接近于零，所以这些样式并没有什么意义）。

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```


<!-- Using element types for defining CSS rules is slightly problematic. If our application contained other <i>li</i> tags, the same style rule would also be applied to them.-->
 使用元素类型来定义CSS规则是有点问题的。如果我们的应用包含其他的<i>li</i>标签，同样的样式规则也会应用于它们。


<!-- If we want to apply our style specifically to notes, then it is better to use [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).-->
如果我们想把我们的样式专门应用于笔记，那么最好使用[类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)。


<!-- In regular HTML, classes are defined as the value of the <i>class</i> attribute:-->
 在常规HTML中，类被定义为<i>class</i>属性的值。

```html
<li class="note">some text...</li>
```


<!-- In React we have to use the [className](https://reactjs.org/docs/dom-elements.html#classname) attribute instead of the class attribute. With this in mind, let's make the following changes to our <i>Note</i> component:-->
 在React中，我们必须使用[className](https://reactjs.org/docs/dom-elements.html#classname)属性而不是class属性。考虑到这一点，让我们对我们的<i>Note</i>组件做如下修改。

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
 类选择器是用_.classname_语法定义的。

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```


<!-- If you now add other <i>li</i> elements to the application, they will not be affected by the style rule above.-->
 如果你现在在应用中添加其他<i>li</i>元素，它们将不会受到上述样式规则的影响。


### Improved error message


<!-- We previously implemented the error message that was displayed when the user tried to toggle the importance of a deleted note with the <em>alert</em> method. Let's implement the error message as its own React component.-->
 我们之前实现了当用户试图用<em>alert</em>方法切换已删除笔记的重要性时显示的错误信息。让我们把这个错误信息实现为它自己的React组件。


<!-- The component is quite simple:-->
这个组件很简单。

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
 如果<em>message</em>prop的值是<em>null</em>，那么就不会有任何东西渲染在屏幕上，而在其他情况下，信息会渲染在一个div元素中。


<!-- Let's add a new piece of state called <i>errorMessage</i> to the <i>App</i> component. Let's initialize it with some error message so that we can immediately test our component:-->
 让我们在<i>App</i>组件中添加一个新的状态，叫做<i>errorMessage</i>。让我们用一些错误信息来初始化它，这样我们就可以立即测试我们的组件。

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
 然后让我们添加一个适合错误信息的样式规则。

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
 现在我们准备添加显示错误信息的逻辑。让我们以下列方式改变<em>toggleImportanceOf</em>函数。

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
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
当错误发生时，我们在<em>errorMessage</em>状态中添加一个描述性的错误信息。同时，我们启动一个定时器，在五秒后将<em>errorMessage</em>状态设置为<em>null</em>。

<!-- The result looks like this:-->
 结果看起来是这样的。

![](../../images/2/26e.png)


<!-- The code for the current state of our application can be found in the  <i>part2-7</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-7).-->
 我们应用当前状态的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-7)上的<i>part2-7</i>分支找到。

### Inline styles

<!-- React also makes it possible to write styles directly in the code as so-called [inline styles](https://react-cn.github.io/react/tips/inline-styles.html).-->
 React也可以在代码中直接编写样式，即所谓的[内联样式](https://react-cn.github.io/react/tips/inline-styles.html)。

<!-- The idea behind defining inline styles is extremely simple. Any React component or element can be provided with a set of CSS properties as a JavaScript object through the [style](https://reactjs.org/docs/dom-elements.html#style) attribute.-->
 定义内联样式的想法非常简单。任何React组件或元素都可以通过[style](https://reactjs.org/docs/dom-elements.html#style)属性作为JavaScript对象提供一组CSS属性。

<!-- CSS rules are defined slightly differently in JavaScript than in normal CSS files. Let's say that we wanted to give some element the color green and italic font that's 16 pixels in size. In CSS, it would look like this:-->
 CSS规则在JavaScript中的定义与普通的CSS文件略有不同。比方说，我们想给某个元素加上绿色和16像素的斜体字。在CSS中，它看起来是这样的。

```css
{
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

<!-- But as a React inline style object it would look like this:-->
 但是作为React的内联样式对象，它会如下所示：

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

<!-- Every CSS property is defined as a separate property of the JavaScript object. Numeric values for pixels can be simply defined as integers. One of the major differences compared to regular CSS, is that hyphenated (kebab case) CSS properties are written in camelCase.-->
 每个CSS属性都被定义为JavaScript对象的一个独立属性。像素的数字值可以简单地定义为整数。与普通的CSS相比，其中一个主要区别是，连字符（kebab case）的CSS属性是用camelCase写的。

<!-- Next, we could add a "bottom block" to our application by creating a <i>Footer</i> component and defining the following inline styles for it:-->
 接下来，我们可以通过创建一个<i>Footer</i>组件并为其定义以下内联样式，为我们的应用添加一个 "底层块"。

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

<!-- Inline styles come with certain limitations. For instance, so-called [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can't be used straightforwardly.-->
 内联样式有某些限制。例如，所谓的[伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)不能被直接使用。

<!-- Inline styles and some of the other ways of adding styles to React components go completely against the grain of old conventions. Traditionally, it has been considered best practice to entirely separate CSS from the content (HTML) and functionality (JavaScript). According to this older school of thought, the goal was to write CSS, HTML, and JavaScript into their separate files.-->
 内联样式和其他一些为React组件添加样式的方式完全违背了旧的惯例。传统上，人们认为最好的做法是将CSS与内容（HTML）和功能（JavaScript）完全分开。根据这个老的思想流派，目标是将CSS、HTML和JavaScript写进各自的文件。


<!-- The philosophy of React is, in fact, the polar opposite of this. Since the separation of CSS, HTML, and JavaScript into separate files did not seem to scale well in larger applications, React bases the division of the application along the lines of its logical functional entities.-->
事实上，React的哲学是与此截然相反的。由于将CSS、HTML和JavaScript分离到不同的文件中，在大型应用中似乎不能很好地扩展，React将应用的划分建立在其逻辑功能实体的基础上。


<!-- The structural units that make up the application's functional entities are React components. A React component defines the HTML for structuring the content, the JavaScript functions for determining functionality, and also the component's styling; all in one place. This is to create individual components that are as independent and reusable as possible.-->
 构成应用功能实体的结构单元是React组件。一个React组件定义了构造内容的HTML，决定功能的JavaScript函数，以及组件的样式；所有这些都在一个地方。这是为了创建尽可能独立和可重复使用的单个组件。

<!-- The code of the final version of our application can be found in the  <i>part2-8</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-8).-->
 我们应用的最终版本的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-8)的<i>part2-8</i>分支中找到。

</div>

<div class="tasks">

<h3>Exercises 2.19.-2.20.</h3>

<h4>2.19: Phonebook step11</h4>

<!-- Use the [improved error message](/en/part2/adding_styles_to_react_app#improved-error-message) example from part 2 as a guide to show a notification that lasts for a few seconds after a successful operation is executed (a person is added or a number is changed):-->
 使用第二章节的[改进的错误信息](/en/part2/adding_styles_to_react_app#improved-error-message)的例子作为指导，在成功的操作被执行后（一个人被添加或一个数字被改变）显示一个持续几秒钟的通知。

![](../../images/2/27e.png)

<h4>2.20*: Phonebook step12</h4>

<!-- Open your application in two browsers. **If you delete a person in browser 1** a short while before attempting to <i>change the person's phone number</i> in browser 2, you will get the following error message:-->
 在两个浏览器中打开你的应用。**如果你在浏览器1中删除一个人，**在浏览器2中尝试<i>改变这个人的电话号码</i>之前的一小段时间，你会得到以下错误信息。

![](../../images/2/29b.png)

<!-- Fix the issue according to the example shown in [promise and errors](/en/part2/altering_data_in_server#promises-and-errors) in part 2. Modify the example so that the user is shown a message when the operation does not succeed. The messages shown for successful and unsuccessful events should look different:-->
按照第二章节中[承诺和错误](/en/part2/altering_data_in_server#promises-and-errors)所示的例子来解决这个问题。修改这个例子，使用户在操作不成功时显示一条信息。为成功和不成功的事件显示的信息应该是不同的。

![](../../images/2/28e.png)

<!-- **Note** that even if you handle the exception, the error message is printed to the console.-->
 **注意**，即使你处理了异常，错误信息也会打印到控制台。

<!-- This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
 这是课程中这一部分的最后一个练习。现在是时候把你的代码推送到GitHub，并把你所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。

</div>
