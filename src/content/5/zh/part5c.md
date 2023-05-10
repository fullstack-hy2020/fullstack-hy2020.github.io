---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: zh
---

<div class="content">

<!-- There are many different ways of testing React applications. Let''s take a look at them next.-->
有許多不同的測試React應用程式的方式。讓我們來看看它們。

<!-- Tests will be implemented with the same [Jest](http://jestjs.io/) testing library developed by Facebook that was used in the previous part. Jest is configured by default to applications created with create-react-app.-->
测试将使用Facebook开发的[Jest](http://jestjs.io/)测试库来实施，这是之前部分使用的测试库。 默认情况下，Jest配置为使用create-react-app创建的应用程序。

<!-- In addition to Jest, we also need another testing library that will help us render components for testing purposes. The current best option for this is [react-testing-library](https://github.com/testing-library/react-testing-library) which has seen rapid growth in popularity in recent times.-->
除了Jest之外，我们还需要另一个测试库来帮助我们渲染组件以进行测试。目前这方面的最佳选择是[react-testing-library](https://github.com/testing-library/react-testing-library)，它近来的受欢迎程度迅速增长。

<!-- Let''s install the library with the command:-->
让我们用下面的命令安装库：

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

<!-- We also installed [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) which provides some nice Jest-related helper methods.-->
我们也安装了[jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/)，它提供了一些很棒的Jest相关的辅助方法。

<!-- Let''s first write tests for the component that is responsible for rendering a note:-->
让我们首先为负责渲染一个笔记的组件编写测试：

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

<!-- Notice that the <i>li</i> element has the [CSS](https://reactjs.org/docs/dom-elements.html#classname) classname <i>note</i>, that could be used to access the component in our tests.-->
<i>li</i> 元素具有 [CSS](https://reactjs.org/docs/dom-elements.html#classname) 类名 <i>note</i>，可以用来在我们的测试中访问该组件。

### Rendering the component for tests

<!-- We will write our test in the <i>src/components/Note.test.js</i> file, which is in the same directory as the component itself.-->
我们将在<i>src/components/Note.test.js</i>文件中编写我们的测试，它与组件本身位于同一目录中。

<!-- The first test verifies that the component renders the contents of the note:-->
第一次测试验证组件是否渲染笔记的内容：

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})
```

<!-- After the initial configuration, the test renders the component with the [render](https://testing-library.com/docs/react-testing-library/api#render) function provided by the react-testing-library:-->
在初始配置之后，测试将使用react-testing-library提供的[render](https://testing-library.com/docs/react-testing-library/api#render)函数渲染组件：

```js
render(<Note note={note} />)
```

<!-- Normally React components are rendered to the <i>DOM</i>. The render method we used renders the components in a format that is suitable for tests without rendering them to the DOM.-->
一般来说，React 组件会渲染到 <i>DOM</i> 中。我们使用的 render 方法可以渲染出组件，而无需将它们渲染到 DOM 中，以适应测试的格式。

<!-- We can use the object [screen](https://testing-library.com/docs/queries/about#screen) to access the rendered component. We use screen''s method [getByText](https://testing-library.com/docs/queries/bytext) to search for an element that has the note content and ensure that it exists:-->
我们可以使用对象[screen](https://testing-library.com/docs/queries/about#screen)来访问渲染的组件。我们使用screen''s方法[getByText](https://testing-library.com/docs/queries/bytext)来搜索具有注释内容的元素，并确保它存在：

```js
  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
```

### Running tests

<!-- Create-react-app configures tests to be run in watch mode by default, which means that the _npm test_ command will not exit once the tests have finished, and will instead wait for changes to be made to the code. Once new changes to the code are saved, the tests are executed automatically after which Jest goes back to waiting for new changes to be made.-->
create-react-app默认配置测试以观察模式运行，这意味着_npm test_命令在测试完成后不会退出，而是等待代码进行更改。 一旦保存了对代码的新更改，测试将自动执行，然后Jest回到等待新更改的状态。

<!-- If you want to run tests "normally", you can do so with the command:-->
如果你想正常运行测试，可以使用以下命令：

```js
CI=true npm test
```

<!-- For Windows (PowerShell) users-->
## 对于 Windows（PowerShell）用户

```js
$env:CI=$true; npm test
```

<!-- **NB:** the console may issue a warning if you have not installed Watchman. Watchman is an application developed by Facebook that watches for changes that are made to files. The program speeds up the execution of tests and at least starting from macOS Sierra, running tests in watch mode issues some warnings to the console, that can be removed by installing Watchman.-->
**提示：**如果您没有安装Watchman，控制台可能会发出警告。 Watchman是Facebook开发的一款应用程序，可监视对文件所做的更改。 该程序加快了测试的执行速度，至少从macOS Sierra开始，在观看模式下运行测试会向控制台发出一些警告，可以通过安装Watchman来删除。

<!-- Instructions for installing Watchman on different operating systems can be found on the official Watchman website: <https://facebook.github.io/watchman/>-->
可在官方Watchman网站上找到安装在不同操作系统上Watchman的说明：<https://facebook.github.io/watchman/>

### Test file location

<!-- In React there are (at least) [two different conventions](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) for the test file''s location. We created our test files according to the current standard by placing them in the same directory as the component being tested.-->
在React中，[至少有两种不同的约定](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850)用于测试文件的位置。我们根据当前标准创建了测试文件，将它们放在与要测试的组件相同的目录中。

<!-- The other convention is to store the test files "normally" in a separate _test_ directory. Whichever convention we choose, it is almost guaranteed to be wrong according to someone''s opinion.-->
另一种惯例是正常地将测试文件存储在单独的_test_目录中。无论我们选择哪种惯例，几乎可以肯定根据某人的意见是错误的。

<!-- I do not like this way of storing tests and application code in the same directory. The reason we choose to follow this convention is that it is configured by default in applications created by create-react-app.-->
我不喜欢把测试代码和应用代码放在同一个目录下。我们之所以选择遵循这种惯例，是因为它是由create-react-app创建的应用程序默认配置的。

### Searching for content in a component

<!-- The react-testing-library package offers many different ways of investigating the content of the component being tested. In reality, the _expect_ in our test is not needed at all-->
.

react-testing-library 包提供了許多不同的方式來調查被測試組件的內容。事實上，我們測試中的 _expect_ 根本不需要。

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  expect(element).toBeDefined() // highlight-line
})
```

<!-- Test fails if _getByText_ does not find the element it is looking for.-->
如果_getByText_找不到它正在寻找的元素，测试就会失败。

<!-- We could also use [CSS-selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) to find rendered elements by using the method [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) of the object [container](https://testing-library.com/docs/react-testing-library/api/#container-1) that is one of the fields returned by the render:-->
我们也可以使用[CSS 选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) 通过 [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) 方法来查找渲染元素，[container](https://testing-library.com/docs/react-testing-library/api/#container-1) 是 render 返回的一个字段：

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />) // highlight-line

// highlight-start
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  // highlight-end
})
```

<!-- There are also other methods, eg. [getByTestId](https://testing-library.com/docs/queries/bytestid/), that look for elements based on id-attributes that are inserted into the code specifically for testing purposes.-->
也有其他的方法，例如[getByTestId](https://testing-library.com/docs/queries/bytestid/)，它根据特定于测试目的插入到代码中的id属性查找元素。

### Debugging tests

<!-- We typically run into many different kinds of problems when writing our tests.-->
我们在编写测试时通常会遇到许多不同类型的问题。

<!-- Object _screen_ has method [debug](https://testing-library.com/docs/queries/about/#screendebug) that can be used to print the HTML of a component to the terminal. If we change the test as follows:-->
对象_screen_具有可以用来将组件的HTML打印到终端的[debug](https://testing-library.com/docs/queries/about/#screendebug)方法。如果我们改变测试如下：

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  screen.debug() // highlight-line

  // ...

})
```

<!-- the HTML gets printed to the console:-->
控制台会打印出HTML：

```js
console.log
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

<!-- It is also possible to use the same method to print a wanted element to console:-->
也可以使用同样的方法将想要的元素打印到控制台：

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  screen.debug(element)  // highlight-line

  expect(element).toBeDefined()
})
```

<!-- Now the HTML of the wanted element gets printed:-->
现在想要的元素的HTML被打印出来了：

```js
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

<!-- In addition to displaying content, the <i>Note</i> component also makes sure that when the button associated with the note is pressed, the _toggleImportance_ event handler function gets called.-->
此外，<i>Note</i> 组件还确保，当按下与笔记相关联的按钮时，会调用 _toggleImportance_ 事件处理函数。

<!-- Let us install a library [user-event](https://testing-library.com/docs/user-event/intro) that makes simulating user input a bit easier:-->
让我们安装一个库[user-event](https://testing-library.com/docs/user-event/intro)，它可以使模拟用户输入变得更容易：

```bash
npm install --save-dev @testing-library/user-event
```

<!-- Testing this functionality can be accomplished like this:-->
测试这个功能可以这样完成：

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // highlight-line
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

<!-- There are a few interesting things related to this test. The event handler is a [mock](https://facebook.github.io/jest/docs/en/mock-functions.html) function defined with Jest:-->
有几件有趣的事情与这个测试有关。事件处理程序是一个用Jest定义的[模拟](https://facebook.github.io/jest/docs/en/mock-functions.html)函数：

```js
const mockHandler = jest.fn()
```

<!-- A [session](https://testing-library.com/docs/user-event/setup/) is started to interact with the rendered component:-->
一个[会话](https://testing-library.com/docs/user-event/setup/)已开始用于与渲染的组件交互：

```js
const user = userEvent.setup()
```

<!-- The test finds the button <i>based on the text</i> from the rendered component and clicks the element:-->
测试根据渲染组件中的文本<i>找到按钮</i>并点击该元素：

```js
const button = screen.getByText('make not important')
await user.click(button)
```

<!-- Clicking happens with the method [click](https://testing-library.com/docs/user-event/convenience/#click) of the userEvent-library.-->
点击可以通过[点击](https://testing-library.com/docs/user-event/convenience/#click)用户事件库的方法来实现。

<!-- The expectation of the test verifies that the <i>mock function</i> has been called exactly once.-->
测试的期望验证了<i>模拟函数</i>已经被正好调用了一次。

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

<!-- [Mock objects and functions](https://en.wikipedia.org/wiki/Mock_object) are commonly used stub components in testing that are used for replacing dependencies of the components being tested. Mocks make it possible to return hardcoded responses, and to verify the number of times the mock functions are called and with what parameters.-->
[模拟对象和函数](https://zh.wikipedia.org/wiki/%E6%A8%A1%E6%8B%9F%E5%AF%B9%E8%B1%A1)通常是在测试中使用的替代组件，用于替换被测试组件的依赖项。模拟可以返回硬编码的响应，并验证模拟函数调用的次数以及使用的参数。

<!-- In our example, the mock function is a perfect choice since it can be easily used for verifying that the method gets called exactly once.-->
在我们的例子中，模拟函数是一个完美的选择，因为它可以轻松地用于验证该方法被正确调用一次。

### Tests for the <i>Togglable</i> component

<!-- Let's write a few tests for the <i>Togglable</i> component. Let's add the <i>togglableContent</i> CSS classname to the div that returns the child components.-->
让我们为<i>Togglable</i>组件编写几个测试。让我们把<i>togglableContent</i> CSS类名添加到返回子组件的div中。

```js
const Togglable = forwardRef((props, ref) => {
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

<!-- The tests are shown below:-->
以下是测试：

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})
```

<!-- The _beforeEach_ function gets called before each test, which then renders the <i>Togglable</i> component and saves the field _container_ of the return value.-->
`beforeEach` 函数在每个测试之前被调用，然后渲染 <i>Togglable</i> 组件并保存返回值的 _container_ 字段。

<!-- The first test verifies that the <i>Togglable</i> component renders its child component-->
第一次测试验证<i>可切换</i>组件是否渲染其子组件

```js
<div className="testDiv">
  togglable content
</div>
```

<!-- The remaining tests use the [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) method to verify that the child component of the <i>Togglable</i> component is not visible initially, by checking that the style of the <i>div</i> element contains _{ display: 'none' }_. Another test verifies that when the button is pressed the component is visible, meaning that the style for hiding the component <i>is no longer</i> assigned to the component.-->
剩下的测试使用[toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle)方法来验证<i>Togglable</i>组件的子组件最初不可见，通过检查<i>div</i>元素的样式包含_{ display: 'none' }_。另一个测试验证按下按钮时组件可见，这意味着隐藏组件的样式<i>不再</i>分配给组件。

<!-- Let''s also add a test that can be used to verify that the visible content can be hidden by clicking the second button of the component:-->
让我们也添加一个测试，用于验证点击组件的第二个按钮可以隐藏可见内容：

```js
describe('<Togglable />', () => {

  // ...

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})
```

### Testing the forms

<!-- We already used the _click_ function of the [user-event](https://testing-library.com/docs/user-event/intro) in our previous tests to click buttons.-->
我们已经在之前的测试中使用了[user-event](https://testing-library.com/docs/user-event/intro)的_click_函数来点击按钮。

```js
const user = userEvent.setup()
const button = screen.getByText('show...')
await user.click(button)
```

<!-- We can also simulate text input with <i>userEvent</i>.-->
我们也可以用<i>userEvent</i>来模拟文本输入。

<!-- Let''s make a test for the <i>NoteForm</i> component. The code of the component is as follows.-->
让我们为<i>NoteForm</i>组件做一个测试。组件的代码如下。

```js
import { useState } from 'react'

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
    <div className="formDiv">
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

<!-- The form works by calling the _createNote_ function it received as props with the details of the new note.-->
該表單通過調用其作為props接收到的_createNote_函數，來提交新筆記的詳細信息。

<!-- The test is as follows:-->
测试如下：

```js
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = jest.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

<!-- Tests get access to the input field using the function [getByRole](https://testing-library.com/docs/queries/byrole).-->
测试可以使用函数[getByRole](https://testing-library.com/docs/queries/byrole)访问输入字段。

<!-- The method [type](https://testing-library.com/docs/user-event/utility#type) of the userEvent is used to write text to the input field.-->
[用户事件](https://testing-library.com/docs/user-event/utility#type)的`type`方法用于将文本写入输入字段。

<!-- The first test expectation ensures, that submitting the form calls the _createNote_ method.-->
第一次测试期望确保，提交表单调用_createNote_方法。
<!-- The second expectation checks, that the event handler is called with the right parameters - that a note with the correct content is created when the form is filled.-->
第二个期望检查，当表单填写完成时，事件处理程序是否以正确的参数调用 - 是否创建了具有正确内容的笔记。

### About finding the elements

<!-- Let us assume that the form has two input fields-->
假设这个表单有两个输入字段

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        // highlight-start
        <input
          value={...}
          onChange={...}
        />
        // highlight-end
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

<!-- Now the approach that our test uses to find the input field-->
is

现在我们测试使用的找到输入字段的方法是

```js
const input = screen.getByRole('textbox')
```

<!-- would cause an error:-->
会导致错误：

![node error that shows two elements with textbox since we use getByRole](../../images/5/40.png)

<!-- The error message suggests using <i>getAllByRole</i>. The test could be fixed as follows:-->
错误消息建议使用<i>getAllByRole</i>。测试可以按照以下方式修复：

```js
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...')
```

<!-- Method <i>getAllByRole</i> now returns an array and the right input field is the first element of the array. However, this approach is a bit suspicious since it relies on the order of the input fields.-->
方法<i>getAllByRole</i>现在返回一个数组，而正确的输入字段是数组的第一个元素。但是，这种方法有点可疑，因为它依赖于输入字段的顺序。

<!-- Quite often input fields have a <i>placeholder</i> text that hints user what kind of input is expected. Let us add a placeholder to our form:-->
<i>常常，输入框会有一个<i>占位符</i>文本来提示用户预期输入什么。让我们为我们的表单添加一个占位符：</i>

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='write note content here' // highlight-line
        />
        <input
          value={...}
          onChange={...}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

<!-- Now finding the right input field is easy with the method [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext):-->
现在，使用[getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext)方法，找到正确的输入字段变得很容易：

```js
test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write note content here') // highlight-line
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...')
  userEvent.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

<!-- The most flexible way of finding elements in tests is the method <i>querySelector</i> of the _container_ object, which is returned by _render_, as was mentioned [earlier in this part](/en/part5/testing_react_apps#searching-for-content-in-a-component). Any CSS selector can be used with this method for searching elements in tests.-->
最灵活的查找测试元素的方法是由`render`返回的_容器_对象的<i>querySelector</i>方法，正如本部分[之前提到的](/en/part5/testing_react_apps#searching-for-content-in-a-component)。可以使用任何CSS选择器来搜索测试中的元素。

<!-- Consider eg. that we would define a unique _id_ to the input field:-->
考虑例如，我们为输入字段定义一个唯一的_id_：

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          id='note-input' // highlight-line
        />
        <input
          value={...}
          onChange={...}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

<!-- The input element could now be found in the test as follows:-->
输入元素现在可以在测试中如下找到：

```js
const { container } = render(<NoteForm createNote={createNote} />)

const input = container.querySelector('#note-input')
```

<!-- However, we shall stick to the approach of using _getByPlaceholderText_ in the test.-->
但是，我们将坚持在测试中使用_getByPlaceholderText_的方法。

<!-- Let us look at a couple of details before moving on. Let us assume that a component would render text to an HTML element as follows:-->
让我们先来看一下几个细节，然后再继续。假设一个组件将文本渲染到HTML元素如下：

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      Your awesome note: {note.content} // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
```

<!-- the _getByText_ command that the test uses does <i>not</i> find the element-->
测试使用的_getByText_命令<i>不</i>能找到元素

```js
test('renders content', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Does not work anymore :(')

  expect(element).toBeDefined()
})
```

<!-- Command _getByText_ looks for an element that has the **same text** that it has as a parameter, and nothing more. If we want to look for an element that <i>contains</i> the text, we could use an extra option:-->
命令_getByText_查找具有**相同文本**的元素，而不是其他内容。如果我们想查找包含文本的元素，我们可以使用额外的选项：

```js
const element = screen.getByText(
  'Does not work anymore :(', { exact: false }
)
```

<!-- or we could use the command _findByText_:-->
我們可以使用指令 _findByText_：

```js
const element = await screen.findByText('Does not work anymore :(')
```

<!-- It is important to notice that, unlike the other _ByText_ commands, _findByText_ returns a promise!-->
重要的是要注意，不像其他的_ByText_命令，_findByText_返回一个承诺！

<!-- There are situations where yet another form of the command _queryByText_ is useful. The command returns the element but <i>it does not cause an exception</i> if the element is not found.-->
有时候，另一种形式的命令_queryByText_很有用。该命令会返回元素，但<i>如果没有找到元素，它不会引发异常</i>。

<!-- We could eg. use the command to ensure that something <i>is not rendered</i> to the component:-->
我们可以使用命令来确保某些东西<i>不会被渲染</i>到组件：

```js
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
```

### Test coverage

<!-- We can easily find out the [coverage](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting) of our tests by running them with the command.-->
我们可以通过运行命令来轻松查看[覆盖率](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting)测试的结果。

```js
CI=true npm test -- --coverage
```

![terminal output of test coverage](../../images/5/18ea.png)

<!-- A quite primitive HTML report will be generated to the <i>coverage/lcov-report</i> directory.-->
一个相当原始的 HTML 报告将会被生成到<i>coverage/lcov-report</i> 目录中。
<!-- The report will tell us the lines of untested code in each component:-->
报告将告诉我们每个组件中未经测试的代码行：

![HTML report of the test coverage](../../images/5/19ea.png)

<!-- You can find the code for our current application in its entirety in the <i>part5-8</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-8).-->
你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part2-notes/tree/part5-8)的<i>part5-8</i>分支中找到我们当前应用程序的完整代码。
</div>

<div class="tasks">

### Exercises 5.13.-5.16.

#### 5.13: Blog list tests, step1

<!-- Make a test, which checks that the component displaying a blog renders the blog''s title and author, but does not render its URL or number of likes by default.-->
测试一下，检查组件是否默认渲染了博客的标题和作者，但不渲染它的 URL 或点赞数。

<!-- Add CSS classes to the component to help the testing as necessary.-->
添加CSS类到组件中以便根据需要帮助测试。

#### 5.14: Blog list tests, step2

<!-- Make a test, which checks that the blog''s URL and number of likes are shown when the button controlling the shown details has been clicked.-->
制作一个测试，检查当点击控制显示细节的按钮时，博客的URL和点赞数是否会显示出来。

#### 5.15: Blog list tests, step3

<!-- Make a test, which ensures that if the <i>like</i> button is clicked twice, the event handler the component received as props is called twice.-->
测试，确保如果点击<i>like</i>按钮两次，则组件作为props接收的事件处理程序被调用两次。

#### 5.16: Blog list tests, step4

<!-- Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.-->
测试新博客表单。测试应检查，当创建新博客时，表单是否正确调用其接收的事件处理程序，并传递正确的详细信息。

</div>

<div class="content">

### Frontend integration tests

<!-- In the previous part of the course material, we wrote integration tests for the backend that tested its logic and connected the database through the API provided by the backend. When writing these tests, we made the conscious decision not to write unit tests, as the code for that backend is fairly simple, and it is likely that bugs in our application occur in more complicated scenarios than unit tests are well suited for.-->
在课程材料的前一部分，我们为后端编写了集成测试，以测试其逻辑并通过后端提供的API连接数据库。编写这些测试时，我们有意识地决定不编写单元测试，因为该后端的代码相当简单，而且很可能我们的应用程序中的错误发生在比单元测试更复杂的场景中。

<!-- So far all of our tests for the frontend have been unit tests that have validated the correct functioning of individual components. Unit testing is useful at times, but even a comprehensive suite of unit tests is not enough to validate that the application works as a whole.-->
到目前为止，我们对前端的所有测试都是单元测试，以验证各个组件的正确功能。单元测试在某些时候是有用的，但是即使是一套全面的单元测试也不足以验证应用程序作为一个整体是否有效。

<!-- We could also make integration tests for the frontend. Integration testing tests the collaboration of multiple components. It is considerably more difficult than unit testing, as we would have to for example mock data from the server.-->
我們也可以為前端做整合測試。整合測試測試多個組件之間的協作。它比單元測試要困難得多，因為我們必須模擬來自伺服器的資料。
<!-- We chose to concentrate on making end-to-end tests to test the whole application. We will work on the end-to-end tests in the last chapter of this part.-->
我们选择集中精力在做端到端测试来测试整个应用程序。我们将在本部分的最后一章节致力于端到端测试。

### Snapshot testing

<!-- Jest offers a completely different alternative to "traditional" testing called [snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html) testing. The interesting feature of snapshot testing is that developers do not need to define any tests themselves, it is simple enough to adopt snapshot testing.-->
Jest 提供了一种完全不同的替代“传统”测试的方法，称为[快照](https://facebook.github.io/jest/docs/en/snapshot-testing.html)测试。快照测试有趣的特性是开发人员不需要自己定义任何测试，采用快照测试非常简单。

<!-- The fundamental principle is to compare the HTML code defined by the component after it has changed the HTML code that existed before it was changed.-->
基本原则是比较组件定义的HTML代码，它改变了之前存在的HTML代码之后。

<!-- If the snapshot notices some change in the HTML defined by the component, then either it is new functionality or a "bug" caused by accident. Snapshot tests notify the developer if the HTML code of the component changes. The developer has to tell Jest if the change was desired or undesired. If the change to the HTML code is unexpected, it strongly implies a bug, and the developer can become aware of these potential issues easily thanks to snapshot testing.-->
如果快照通知中有组件定义的HTML发生变化，那么要么是新的功能，要么是意外造成的“错误”。快照测试会通知开发人员组件的HTML代码是否改变。开发人员必须告诉Jest这种变化是期望的还是不期望的。如果HTML代码的变化是意外的，那么很可能是一个bug，多亏了快照测试，开发人员可以很容易地意识到这些潜在的问题。

</div>
