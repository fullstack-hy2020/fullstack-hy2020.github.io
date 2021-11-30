---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: zh
---

<div class="content">



<!-- There are many different ways of testing React applications. Let's take a look at them next. -->
测试 React 应用程序有许多不同的方法。 接下来让我们看看它们。

<!-- Tests will be implemented with the same [Jest](http://jestjs.io/) testing library developed by Facebook that was used in the previous part. Jest is actually configured by default to applications created with create-react-app. -->
测试将使用与前一章节相同的由 Facebook 开发的 Jest 测试库来实现。create-react-app 默认添加了 Jest 。

<!-- In addition to Jest, we also need another testing library that will help us render components for testing purposes. The current best option for this is[react-testing-library](https://github.com/testing-library/react-testing-library) which has seen rapid growth in popularity in recent times. -->

除了 Jest 之外，我们还需要另一个测试库，它将帮助我们以测试目的渲染组件。 目前最好的选择是[react-testing-library](https://github.com/testing-library/react-testing-library) ，这个库在最近几年迅速流行起来。

<!-- Let's install the library with the command: -->
让我们用以下命令来安装这个库:

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

<!-- Let's first write tests for the component that is responsible for rendering a note: -->
让我们首先为负责渲染 Note 的组件编写测试:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li className='note'> // highlight-line
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

<!-- Notice that the <i>li</i> element has the [CSS](https://reactjs.org/docs/dom-elements.html#classname) classname <i>note</i>, that is used to access the component in our tests. -->
注意，li 元素具有 [CSS](https://reactjs.org/docs/dom-elements.html#classname) classname <i>note</i> ，用于访问我们测试中的组件。

### Rendering the component for tests
【为测试渲染组件】

<!-- We will write our test in the <i>src/components/Note.test.js</i> file, which is in the same directory as the component itself. -->
我们将在 <i>src/components/Note.test.js</i> 中编写测试，它与组件本身在同一个目录中。

<!-- The first test verifies that the component renders the contents of the note: -->
第一个测试验证组件是否渲染了 Note 的内容:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
```

<!-- After the initial configuration, the test renders the component with the [render](https://testing-library.com/docs/react-testing-library/api#render) method provided by the react-testing-library: -->
在初始配置之后，测试使用 react-testing-library 提供的 [render](https://testing-library.com/docs/react-testing-library/api#render) 方法渲染组件:

```js
const component = render(
  <Note note={note} />
)
```

<!-- Normally React components are rendered to the <i>DOM</i>. The render method we used renders the components in a format that is suitable for tests without rendering them to the DOM. -->
通常 React 会将组件渲染给<i>DOM</i>。 我们使用的 render 方法以适合于测试的格式渲染组件，而不需要将它们渲染给 DOM。

<!-- _render_ returns an object that has several [properties](https://testing-library.com/docs/react-testing-library/api#render-result). One of the properties is called <i>container</i>, and it contains all of the HTML rendered by the component. -->
Render 返回一个具有多个[属性](https://testing-library.com/docs/react-testing-library/api#render-result)的对象。 其中一个属性称为<i>container</i>，它包含由组件渲染的所有 HTML。 

<!-- In the expectation, we verify that the component renders the correct text, which in this case is the content of the note: -->
在except中，我们验证组件是否渲染出正确的文本，在本例中，该文本就是 Note 的内容:

```js
expect(component.container).toHaveTextContent(
  'Component testing is done with react-testing-library'
)
```

### Running tests
【运行测试】

<!-- Create-react-app configures tests to be run in watch mode by default, which means that the _npm test_ command will not exit once the tests have finished, and will instead wait for changes to be made to the code. Once new changes to the code are saved, the tests are executed automatically after which Jest goes back to waiting for new changes to be made. -->
Create-react-app 默认情况下将测试配置为在 watch 模式下运行，这意味着 _npm test_ 命令在测试结束后不会退出，而是等待对代码进行更改。 一旦保存了对代码的新的更改，测试就会自动执行，然后 Jest 等待新的更改。 

<!-- If you want to run tests "normally", you can do so with the command: -->
如果你想“正常地”运行测试，你可以使用以下命令:

```js
CI=true npm test
```

<!-- **NB:** the console may issue a warning if you have not installed Watchman. Watchman is an application developed by Facebook that watches for changes that are made to files. The program speeds up the execution of tests and at least starting from macOS Sierra, running tests in watch mode issues some warnings to the console, that can be gotten rid of by installing Watchman. -->

注意: 如果您没有安装 Watchman，控制台可能会发出警告。 Watchman 是 Facebook 开发的一个应用程序，可以监视文件的变化。 这个程序加快了测试的执行速度，至少从 macOS Sierra 开始，在 watch 模式下运行测试会向控制台发出一些警告，这些警告可以通过安装 Watchman 来消除。

<!-- Instructions for installing Watchman on different operating systems can be found on the official Watchman website: https://facebook.github.io/watchman/ -->

在不同操作系统上安装 Watchman 的说明可以在 Watchman 官方网站上找到: https://facebook.github.io/Watchman/

### Test file location

<!-- In React there are (at least) [two different conventions](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) for the test file's location. We created our test files according to the current standard by placing them in the same directory as the component being tested. -->

在 React 中，关于测试文件的位置(至少)有[两个不同的约定](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) 。 我们当前的标准是创建测试文件，将它们放在与被测试组件相同的目录中。

<!-- The other convention is to store the test files "normally" in their own separate directory. Whichever convention we choose, it is almost guaranteed to be wrong according to someone's opinion. -->
另一个约定是将测试文件“正常”存储在它们自己的单独目录中。 无论我们选择哪种惯例，都会觉得另一种是完全错误的。

<!-- Personally, I do not like this way of storing tests and application code in the same directory. The reason we choose to follow this convention is that it is configured by default in applications created by create-react-app. -->
就我个人而言，我不喜欢这种将测试和应用程序代码存储在同一个目录中的方式。 我们之所以选择遵循这个约定，是因为它是在 create-react-app 创建的应用程序中默认配置的。

### Searching for content in a component
【在组件中搜寻内容】

<!-- The react-testing-library package offers many different ways of investigating the content of the component being tested. Let's slightly expand our test: -->
react-testing-library 包提供了许多不同的方法来研究被测试组件的内容。 让我们稍微扩展一下我们的测试: 

```js
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  // method 1
  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // method 2
  const element = component.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()

  // method 3
  const div = component.container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
```

<!-- The first way uses method <i>toHaveTextContent</i> to search for a matching text from the entire HTML code rendered by the component.    -->
第一种方法是使用<i>toHaveTextContent</i>方法从组件渲染的整个 HTML 代码中搜索匹配的文本。

<!--<i>toHaveTextContent</i> is one of many "matcher"-methods that are provided by the  [jest-dom](https://github.com/testing-library/jest-dom#tohavetextcontent) library.-->
<i>toHaveTextContent</i>  是许多“匹配器”方法之一，这些方法是由[jest-dom](https://github.com/testing-library/jest-dom#toHaveTextContent)库提供的。

<!-- The second way uses the [getByText](https://testing-library.com/docs/dom-testing-library/api-queries#bytext) method of the object returned by the render method. The method returns the element that contains the given text. An exception occurs if no such element exists. For this reason, we would technically not need to specify any additional expectation. -->
第二种方法是使用 render 方法返回对象的[getByText](https://testing-library.com/docs/dom-testing-library/api-queries#bytext) 。 该方法返回包含给定文本的元素。如果不存在此类元素，则发生异常。 出于这个原因，我们在技术上不需要指定任何额外的except。

<!-- The third way is to search for a specific element that is rendered by the component with the [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) method that receives a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) as its parameter. -->
第三种方法是搜索由组件渲染的特定元素，该组件使用[querySelector](https://developer.mozilla.org/en-us/docs/web/api/document/querySelector)方法，该方法接收[CSS 选择器](https://developer.mozilla.org/en-us/docs/web/CSS/css_selectors)作为其参数。

<!-- The last two methods use the methods <i>getByText</i> and <i>querySelector</i> to find an element matching some condition from the rendered component.  -->
最后两个方法使用<i>getByText</i> 和<i>querySelector</i> 方法从渲染的组件中查找匹配某些条件的元素。
<!-- There are numerous similiar query methods [available](https://testing-library.com/docs/dom-testing-library/api-queries). -->
有许多类似的查询方法[可用](https://testing-library.com/docs/dom-testing-library/api-queries)。

### Debugging tests
【调试测试】

<!-- We typically run into many different kinds of problems when writing our tests. -->
在编写测试时，我们通常会遇到许多不同类型的问题。

<!-- The object returned by the render method has a [debug](https://testing-library.com/docs/react-testing-library/api#debug) method that can be used to print the HTML rendered by the component to the console. Let's try this out by making the following changes to our code: -->
由 render 方法返回的对象具有一个调试方法[debug](https://testing-library.com/docs/react-testing-library/api#debug) ，该方法可用于将组件渲染的 HTML 打印到控制台。 让我们通过对代码进行以下更改来尝试一下:

```js
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  component.debug() // highlight-line

  // ...
})
```

<!-- We can see the HTML generated by the component in the console: -->
我们可以在控制台中看到由组件生成的 HTML:

```js
console.log node_modules/@testing-library/react/dist/index.js:90
  <body>
    <div>
      <li
        class="note"
      >
        Component testing is done with react-testing-library
        <button>
          make not important
        </button>
      </li>
    </div>
  </body>
```

<!-- It is also possible to search for a smaller part of the component and print its HTML code. In order to do this, we need the _prettyDOM_ method that can be imported from the <i>@testing-library/dom</i> package that is automatically installed with react-testing-library: -->
还可以搜索组件的一小部分并打印其 HTML 代码。 为了做到这一点，我们需要 _prettyDOM_ 方法，该方法可以从 <i>@testing-library/dom</i> 包中导入，该包通过 react-testing-library 自动安装了:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'  // highlight-line
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )
  const li = component.container.querySelector('li')
  
  console.log(prettyDOM(li)) // highlight-line
})
```

<!-- We used the selector to find the <i>li</i> element inside of the component, and printed its HTML to the console: -->
我们使用选择器查找组件内部的 li 元素，并将其 HTML 输出到控制台:

```js
console.log src/components/Note.test.js:21
  <li
    class="note"
  >
    Component testing is done with react-testing-library
    <button>
      make not important
    </button>
  </li>
```

### Clicking buttons in tests
【在测试中点击按钮】

<!-- In addition to displaying content, the <i>Note</i> component also makes sure that when the button associated with the note is pressed, the _toggleImportance_ event handler function gets called. -->

除了显示内容之外， <i>Note</i> 组件还确保在按下与 Note 关联的按钮时，调用 _toggleImportance_ 事件处理函数。

<!-- Testing this functionality can be accomplished like this: -->
测试这个功能可以这样完成:

```js
import React from 'react'
import { render, fireEvent } from '@testing-library/react' // highlight-line
import { prettyDOM } from '@testing-library/dom'
import Note from './Note'

// ...

test('clicking the button calls event handler once', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  const component = render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const button = component.getByText('make not important')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

<!-- There's a few interesting things related to this test. The event handler is [mock](https://facebook.github.io/jest/docs/en/mock-functions.html) function defined with Jest: -->
关于这个测试有一些有趣的事情。 事件处理程序是用 Jest 定义的 [mock](https://facebook.github.io/jest/docs/en/mock-functions.html) 函数:

```js
const mockHandler = jest.fn()
```

<!-- The test finds the button <i>based on the text</i> from the rendered component and clicks the element: -->
测试根据渲染组件的文本找到按钮，然后单击元素:

```js
const button = component.getByText('make not important')
fireEvent.click(button)
```

<!-- Clicking happens with the [fireEvent](https://testing-library.com/docs/api-events#fireevent) method. -->
使用 [fireEvent](https://testing-library.com/docs/api-events#fireevent) 方法进行单击。

<!-- The expectation of the test verifies that the <i>mock function</i> has been called exactly once. -->
测试的期望验证 <i>mock function</i> 是否只被调用了一次。

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

<!-- [Mock objects and functions](https://en.wikipedia.org/wiki/Mock_object) are commonly used stub components in testing that are used for replacing dependencies of the components being tested. Mocks make it possible to return hardcoded responses, and to verify the number of times the mock functions are called and with what parameters. -->

[模拟对象和函数](https://en.wikipedia.org/wiki/Mock_object) 是测试中常用的根组件，用于替换被测试组件的依赖项。 通过 mock 可以返回硬编码的响应，并验证调用 mock 函数的次数和参数。【TODO】

<!-- In our example, the mock function is a perfect choice since it can be easily used for verifying that the method gets called exactly once. -->
在我们的示例中，mock 函数是一个完美的选择，因为它可以很容易地用于验证方法是否只被调用一次。

### Tests for the Togglable component
【测试可切换组件】

<!-- Let's write a few tests for the <i>Togglable</i> component. Let's add the <i>togglableContent</i> CSS classname to the div that returns the child components. -->
让我们为 Togglable 组件编写一些测试。 让我们将 <i>togglableContent</i> CSS classname 添加到返回子组件的 div。

```js
const Togglable = React.forwardRef((props, ref) => {
  // ...

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent"> // highlight-line
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
```

<!-- The tests are shown below: -->
测试结果如下:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" />
      </Togglable>
    )
  })

  test('renders its children', () => {
    expect(
      component.container.querySelector('.testDiv')
    ).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('.togglableContent')

    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('show...')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

})
```

<!-- The _beforeEach_ function gets called before each test, which then renders the <i>Togglable</i> component into the _component_ variable -->
_beforeEach_ 函数在每个测试之前会被调用，然后将 Togglable 组件渲染到 _component_ 变量中

<!-- The first test verifies that the <i>Togglable</i> component renders its child component `<div className="testDiv" />`. -->

第一个测试验证 Togglable 组件是否渲染了其子组件 `<div className="testDiv" />`。

<!-- The remaining tests use the [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) method to verify that the child component of the <i>Togglable</i> component is not visible initially, by checking that the style of the <i>div</i> element contains `{ display: 'none' }`. Another test verifies that when the button is pressed the component is visible, meaning that the style for hiding the component <i>is no longer</i> assigned to the component. -->
剩下的测试使用 [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) 方法，通过检查 div 元素的样式是否包含`{ display: 'none' }` ，来验证 Togglable 组件的子组件最初是否可见。 另一个测试验证按钮被按下时组件是可见的，这意味着隐藏组件的样式不再附着到这个组件中。

<!-- The button is searched for once again based on the text that it contains. The button could have been located also with the help of a CSS selector: -->
根据按钮所包含的文本再次搜索按钮。 这个按钮也可以通过 CSS 选择器来定位:

```js
const button = component.container.querySelector('button')
```

<!-- The component contains two buttons, but since [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) returns the <i>first</i> matching button, we happen to get the button that we wanted. -->
该组件包含两个按钮，但由于 [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) 返回第一个匹配按钮，因此我们碰巧得到了所需的按钮。

<!-- Let's also add a test that can be used to verify that the visible content can be hidden by clicking the second button of the component: -->
我们还可以添加一个测试，通过点击组件的第二个按钮来验证可见内容是否可以隐藏:

```js
test('toggled content can be closed', () => {
  const button = component.container.querySelector('button')
  fireEvent.click(button)

  const closeButton = component.container.querySelector(
    'button:nth-child(2)'
  )
  fireEvent.click(closeButton)

  const div = component.container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})
```

<!-- We defined a selector that returns the second button `button:nth-child(2)`. It's not a wise move to depend on the order of the buttons in the component, and it is recommended to find the elements based on their text: -->
我们定义了一个选择器，它返回第二个按钮: `button:nth-child(2)`。 根据组件中按钮的顺序查找元素是不明智的，建议根据文本查找元素:

```js
test('toggled content can be closed', () => {
  const button = component.getByText('show...')
  fireEvent.click(button)

  const closeButton = component.getByText('cancel')
  fireEvent.click(closeButton)

  const div = component.container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})
```

<!-- The _getByText_ method that we used is just one of the many [queries](https://testing-library.com/docs/api-queries#queries) <i>react-testing-library</i> offers. -->
我们使用的 getByText 方法只是我提供的众多[查询](https://testing-library.com/docs/api-queries#queries)中的一个。




### Testing the forms 
【测试表单】


<!-- We already used the [fireEvent](https://testing-library.com/docs/api-events#fireevent) function in our previous tests to click buttons. -->
在前面的测试中，我们已经使用了[fireEvent](https://testing-library.com/docs/api-events#fireEvent)函数来单击按钮。

```js
const button = component.getByText('show...')
fireEvent.click(button)
```



<!-- In practice we used the <i>fireEvent</i> to create a <i>click</i> event for the button component.  -->
实际上，我们不仅可以使用<i>fireEvent</i> 为按钮组件创建<i>click</i> 事件。
<!-- We cal also simulate text input with <i>fireEvent</i>. -->
我们还可以使用<i>fireEvent</i> 来模拟文本输入。



<!-- Let's make a test for the <i>NoteForm</i> component. The code of the component is as follows -->
让我们对<i>NoteForm</i> 组件进行测试

```js
import React, { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
    })

    setNewNote('')
  }

  return (
    <div className="formDiv"> // highlight-line
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```



<!-- The form works by calling the _createNote_ function it received as props with the details of the new note. -->
该表单通过调用作为props接收的 createNote 函数以及新便笺的细节来工作。



<!-- The test is as follows: -->
测试内容如下:

```js
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'

test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  const component = render(
    <NoteForm createNote={createNote} />
  )

  const input = component.container.querySelector('input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, { 
    target: { value: 'testing of forms could be easier' } 
  })
  fireEvent.submit(form)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing of forms could be easier' )
})
```



<!-- We can simulate writing to <i>input</i> fields by creating an <i>change</i> event to them, and defining an object, which contains the text 'written' to the field. -->
我们可以通过为<i>input</i> 字段创建一个<i>change</i> 事件，并定义一个包含写入字段的文本的对象来模拟对<i>input</i> 字段的写入。

<!-- The form is sent by simulating the <i>submit</i> event to the form. -->
表单通过模拟<i>submit</i> 事件发送到表单。


<!-- The first test expectation ensures, that submitting the form calls the _createNote_ method.  -->
第一个测试期望确保提交表单调用 createNote 方法。
<!-- The second expectation checks, that the event handler is called with the right parameters - that a note with the correct content is created when the form is filled.  -->
第二个期望检查，使用正确的参数调用事件处理程序——即在填写表单时创建具有正确内容的通知。

### Test coverage
【测试覆盖范围】


<!-- We can easily find out the [coverage](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting) of our tests by running them with the command -->
通过运行如下命令，我们可以很容易地找到我们测试的覆盖范围[coverage](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting) 


```js
CI=true npm test -- --coverage
```

![](../../images/5/18ea.png)

<!-- Quite primitive HTML raport will be generated to the <i>coverage/lcov-report</i> directory.  -->
 <i>coverage/lcov-report</i>目录将生成相当原始的 HTML raport。

<!-- The report will tell us the lines of untested code in each component: -->
该报告会告诉我们每个组件中未经测试的代码行:

![](../../images/5/19ea.png)



<!-- You can find the code for our current application in its entirety in the <i>part5-8</i> branch of [this Github repository](https://github.com/fullstack-hy/part2-notes/tree/part5-8). -->
您可以在[this Github repository](https://github.com/fullstack-hy/part2-notes/tree/part5-8)的<i>part5-8</i> 分支中找到我们当前应用的全部代码。
</div>



<div class="tasks">


### Exercises 5.13.-5.16.


#### 5.13: Blog list tests, 步骤1

<!-- Make a test, which checks that the component displaying a blog renders the blog's title and author, but does not render its url or number of likes by default -->
做一个测试，检查显示博客的组件是否渲染了博客的标题和作者，但默认情况下不渲染其 url 或赞数

<!-- Add CSS-classes to the component to help the testing as necessary.  -->
向组件中添加 css 类以帮助进行必要的测试。

#### 5.14*: Blog list tests, 步骤2

<!-- Make a test, which checks that blog's url and number of likes are shown when the button controlling the shown details has been clicked.  -->
做一个测试，当点击控制显示的详细信息的按钮时，检查博客的网址和赞的数量。

#### 5.15*: Blog list tests, 步骤3
<!-- Make a test which ensures that if the <i>like</i> button is clicked twice, the event handler the component received as props is called twice.  -->
进行一个测试，确保如果单击<i>like</i> 按钮两次，那么作为props接收的组件的事件处理程序将创建两次。

#### 5.16*: Blog list tests, 步骤4
<!-- Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is called.  -->
为新的博客表单做一个测试。 测试应该检查，当调用新建博客时，表单是否使用正确的细节调用它作为props接收的事件处理程序。

<!-- If, for example, you give an <i>input</i> element id 'author': -->
<!-- If, for example, you set an <i>input</i> element's id attribute as 'author': -->
例如，如果你设置<i>input</i> 元素的 id 属性为 'author' :

```js
<input
  id='author'
  value={author}
  onChange={() => {}}
/>
```

<!-- You can access the contents of the field with -->
您可以使用如下命令访问字段的内容:

```js
const author = component.container.querySelector('#author')
```

</div>


<div class="content">


### Frontend integration tests
【前端集成测试】

<!-- In the previous part of the course material, we wrote integration tests for the backend that tested its logic and connected database through the API provided by the backend. When writing these tests, we made the conscious decision not to write unit tests, as the code for that backend is fairly simple, and it is likely that bugs in our application occur in more complicated scenarios that integration tests are well suited for. -->
在课程教材的前面章节，我们为后端编写了集成测试，测试其逻辑并通过后端提供的 API 连接数据库。 在编写这些测试时，我们有意识地不编写单元测试，因为后端的代码相当简单，但是我们应用中的错误可能发生在更复杂的场景中，而单元测试非常适合这些场景。

<!-- So far all of our tests for the frontend have been unit tests that have validated the correct functioning of individual components. Unit testing is useful at times, but even a comprehensive suite of unit tests is not enough to validate that the application works as a whole. -->
到目前为止，我们对前端的所有测试都是单元测试，这些测试验证了单个组件的正确功能。单元测试有时很有用，但即使是一套完整的单元测试套件也不足以验证应用作为一个整体是否工作。

<!-- We could also make integration tests for the frontend. Integration testing tests the collaboration of multiple components. It is considerably more difficult than unit testing, as we would have to for example mock data from the server.  -->
我们也可以对前端进行集成测试。集成测试可测试多组件的协作。这比单元测试要困难得多，因为我们必须（例如）从服务器模拟数据。

<!-- We chose to concentrate on making end to end tests in order to test the whole application. We will work on the end to end tests in the last chapter of this part. -->
我们决定集中采用端到端的测试以测试整个应用程序，我们将在本章的最后一节中进行研究。

### Snapshot testing
【快照测试】

<!-- Jest offers a completely different alternative to "traditional" testing called [snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html) testing. The interesting feature of snapshot testing is that developers do not need to define any tests themselves, it is simply enough to adopt snapshot testing.  -->
Jest 提供了一种与“传统”测试完全不同的替代方法，称为[snapshot](https://facebook.github.io/Jest/docs/en/snapshot-testing.html)。 快照测试的有趣特性是开发人员不需要自己定义任何测试，只需要采用快照测试即可。 

<!-- The fundamental principle is to compare the HTML code defined by the component after it has changed to the HTML code that existed before it was changed. -->
基本原则是比较组件更改后定义的 HTML 代码和更改前存在的 HTML 代码。

<!-- If the snapshot notices some change in the HTML defined by the component, then either it is new functionality or a "bug" caused by the accident. Snapshot tests notify the developer if the HTML code of the component changes. The developer has to tell Jest if the change was desired or undesired. If the change to the HTML code is unexpected it strongly implicates a bug, and developer can become aware of these potential issues easily thanks to snapshot testing. -->
如果快照注意到组件定义的 HTML 中发生了一些变化，那么它要么是新功能，要么是由于意外造成的“ bug”。 如果组件的 HTML 代码发生更改，快照测试会通知开发人员。 开发人员必须告诉 Jest 是否需要更改。 如果 HTML 代码的更改是意想不到的，那么它一定会隐含一个 bug，而由于快照测试，开发人员可以很容易地意识到这些潜在的问题。

</div>

