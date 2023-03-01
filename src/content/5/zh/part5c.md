---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: zh
---

<div class="content">

<!-- There are many different ways of testing React applications. Let's take a look at them next.-->
 测试React应用有很多不同的方法。让我们接下来看看它们。

<!-- Tests will be implemented with the same [Jest](http://jestjs.io/) testing library developed by Facebook that was used in the previous part. Jest is actually configured by default to applications created with create-react-app.-->
 测试将用Facebook开发的[Jest](http://jestjs.io/)测试库来实现，这在上一部分中已经使用。Jest实际上是默认配置给用create-react-app创建的应用的。

<!-- In addition to Jest, we also need another testing library that will help us render components for testing purposes. The current best option for this is [react-testing-library](https://github.com/testing-library/react-testing-library) which has seen rapid growth in popularity in recent times.-->
 除了Jest之外，我们还需要另一个测试库，它可以帮助我们为测试目的渲染组件。目前最好的选择是[react-testing-library](https://github.com/testing-library/react-testing-library)，它在最近的时间里得到了快速的发展。

<!-- Let's install the library with the command:-->
 让我们用命令来安装这个库。

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

<!-- We installed also [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) that provides some nice Jest-related helper methods.-->
 我们还安装了[jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/)，它提供了一些不错的与Jest相关的辅助方法。

<!-- Let's first write tests for the component that is responsible for rendering a note:-->
 让我们首先为负责渲染注释的组件编写测试。

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
 注意，<i>li</i>元素有[CSS](https://reactjs.org/docs/dom-elements.html#classname)的类名<i>note</i>，这可以用来在我们的测试中访问该组件。

### Rendering the component for tests

<!-- We will write our test in the <i>src/components/Note.test.js</i> file, which is in the same directory as the component itself.-->
 我们将在<i>src/components/Note.test.js</i>文件中编写测试，该文件与组件本身在同一目录中。

<!-- The first test verifies that the component renders the contents of the note:-->
 第一个测试是验证该组件是否渲染了笔记的内容。

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
 在初始配置之后，测试用react-testing-library提供的[render](https://testing-library.com/docs/react-testing-library/api#render)函数渲染该组件。

```js
render(<Note note={note} />)
```

<!-- Normally React components are rendered to the <i>DOM</i>. The render method we used renders the components in a format that is suitable for tests without rendering them to the DOM.-->
 通常React组件会被渲染到<i>DOM</i>。我们使用的渲染方法将组件渲染成适合测试的格式，而不用渲染到DOM上。

<!-- We can use the object [screen](https://testing-library.com/docs/queries/about#screen) to access the rendered component. We use screen's method [getByText](https://testing-library.com/docs/queries/bytext) to search for an element that has the note content and ensure that it exists:-->
 我们可以使用对象[screen](https://testing-library.com/docs/queries/about#screen)来访问被渲染的组件。我们使用screen's方法[getByText](https://testing-library.com/docs/queries/bytext)来搜索具有注释内容的元素，并确保其存在。


```js
 const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
```

### Running tests

<!-- Create-react-app configures tests to be run in watch mode by default, which means that the _npm test_ command will not exit once the tests have finished, and will instead wait for changes to be made to the code. Once new changes to the code are saved, the tests are executed automatically after which Jest goes back to waiting for new changes to be made.-->
 Create-react-app默认将测试配置为观察模式运行，这意味着_npm test_命令在测试完成后不会退出，而是等待对代码的修改。一旦代码的新变化被保存下来，测试就会自动执行，之后Jest就会回到等待新变化的状态。

<!-- If you want to run tests "normally", you can do so with the command:-->
 如果你想 "正常 "运行测试，你可以用命令来做。

```js
CI=true npm test
```

<!-- **NB:** the console may issue a warning if you have not installed Watchman. Watchman is an application developed by Facebook that watches for changes that are made to files. The program speeds up the execution of tests and at least starting from macOS Sierra, running tests in watch mode issues some warnings to the console, that can be removed by installing Watchman.-->
 **NB:**如果你没有安装Watchman，控制台可能会发出一个警告。Watchman是一个由Facebook开发的应用，它可以观察到对文件所做的改变。该程序加速了测试的执行，至少从macOS Sierra开始，在观察模式下运行测试会向控制台发出一些警告，这些警告可以通过安装Watchman来移除。

<!-- Instructions for installing Watchman on different operating systems can be found on the official Watchman website: https://facebook.github.io/watchman/-->
在不同操作系统上安装Watchman的说明可以在Watchman官方网站上找到： https://facebook.github.io/watchman/

### Test file location

<!-- In React there are (at least) [two different conventions](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) for the test file's location. We created our test files according to the current standard by placing them in the same directory as the component being tested.-->
 在React中，测试文件的位置（至少）有[两个不同的约定](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) 。我们根据目前的标准创建了我们的测试文件，把它们放在与被测试组件相同的目录下。

<!-- The other convention is to store the test files "normally" in their own separate directory. Whichever convention we choose, it is almost guaranteed to be wrong according to someone's opinion.-->
 另一个惯例是将测试文件 "正常 "地存放在他们自己的独立目录中。无论我们选择哪种惯例，根据某人的意见，它几乎可以保证是错误的。

<!-- Personally, I do not like this way of storing tests and application code in the same directory. The reason we choose to follow this convention is that it is configured by default in applications created by create-react-app.-->
 就个人而言，我不喜欢这种将测试和应用代码存放在同一目录下的方式。我们选择遵循这个惯例的原因是，在由create-react-app创建的应用中，它被默认为配置。

### Searching for content in a component

<!-- The react-testing-library package offers many different ways of investigating the content of the component being tested. Actually the expect in our test is not needed at all-->
 react-testing-library包提供了许多不同的方式来调查被测试组件的内容。实际上，我们测试中的期望值根本不需要


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
 如果_getByText_没有找到它要找的元素，则测试失败。

<!-- We could also use [CSS-selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) to find rendered elements by using the method [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) of the object [container](https://testing-library.com/docs/react-testing-library/api/#container-1) that is one of the fields returned by the render:-->
 我们也可以使用[CSS-selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)来寻找渲染的元素，方法是使用对象[container](https://testing-library.com/docs/react-testing-library/api/#container-1)的[querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)，这是渲染返回的字段之一。

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

<!-- There are also other methods, eg. [getByTestId](https://testing-library.com/docs/queries/bytestid/), that is looking for elements based on id-attributes that are inserted to the code specifically for testing purposes.-->
 还有其他一些方法，例如[getByTestId](https://testing-library.com/docs/queries/bytestid/)，它是基于id属性来寻找元素的，这些属性是为了测试目的而专门插入到代码中。

### Debugging tests

<!-- We typically run into many different kinds of problems when writing our tests.-->
 我们在编写测试时通常会遇到许多不同类型的问题。


<!-- Object _screen_ has method [debug](https://testing-library.com/docs/queries/about/#screendebug) that can be used to print the HTML of a component to terminal. If we change the test as follows:-->
 对象_screen_有方法[debug](https://testing-library.com/docs/queries/about/#screendebug)，可以用来打印一个组件的HTML到终端。如果我们把测试改成下面的样子。

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
HTML会被打印到控制台。

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
 也可以用同样的方法来打印一个想要的元素到控制台。

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
 现在，想要的元素的HTML被打印出来。

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
 除了显示内容，<i>Note</i>组件还确保当与笔记相关的按钮被按下时，_toggleImportance_事件处理函数被调用。

<!-- Let us install a library [user-event](https://testing-library.com/docs/user-event/intro) that makes simulating user input a bit easier:-->
让我们安装一个库[user-event](https://testing-library.com/docs/user-event/intro)，使模拟用户输入更容易一些。

```
npm install --save-dev @testing-library/user-event
```

<!-- At the moment of writing (28.1.2022) there is a mismatch between the version of a dependency jest-watch-typeahead that create-react-app and user-event are using. The problem is fixed by installing a specific version:-->
 在写这篇文章的时候（28.1.2022），create-react-app和user-event使用的依赖项jest-watch-typeahead的版本不匹配。这个问题可以通过安装一个特定的版本来解决。

```
npm install -D --exact jest-watch-typeahead@0.6.5
```

<!-- Testing this functionality can be accomplished like this:-->
 测试这个功能可以这样完成。

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
 与这个测试相关的有几个有趣的东西。事件处理程序是一个用Jest定义的[mock](https://facebook.github.io/jest/docs/en/mock-functions.html)函数。

```js
const mockHandler = jest.fn()
```

<!-- A [session](https://testing-library.com/docs/user-event/setup/) is started to interact with the rendered component:-->
 一个[session](https://testing-library.com/docs/user-event/setup/)被启动以与渲染的组件进行交互。
```js
const user = userEvent.setup()
```

<!-- The test finds the button <i>based on the text</i> from the rendered component and clicks the element:-->
 测试从渲染的组件中找到按钮<i>基于文本</i>并点击该元素。

```js
await user.click(button)
const button = screen.getByText('make not important')
```

<!-- Clicking happens with the method [click](https://testing-library.com/docs/user-event/convenience/#click) of the userEvent-library.-->
 点击发生在userEvent-library的[click](https://testing-library.com/docs/user-event/convenience/#click)方法上。


<!-- The expectation of the test verifies that the <i>mock function</i> has been called exactly once.-->
 测试的期望值验证了<i>模拟函数</i>被精确地调用了一次。

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

<!-- [Mock objects and functions](https://en.wikipedia.org/wiki/Mock_object) are commonly used stub components in testing that are used for replacing dependencies of the components being tested. Mocks make it possible to return hardcoded responses, and to verify the number of times the mock functions are called and with what parameters.-->
 [模拟对象和函数](https://en.wikipedia.org/wiki/Mock_object)是测试中常用的存根组件，用于替换被测试组件的依赖关系。模拟对象使得返回硬编码的响应成为可能，并且可以验证模拟函数被调用的次数和参数。

<!-- In our example, the mock function is a perfect choice since it can be easily used for verifying that the method gets called exactly once.-->
 在我们的例子中，模拟函数是一个完美的选择，因为它可以很容易地用于验证方法被精确地调用一次。

### Tests for the <i>Togglable</i> component

<!-- Let's write a few tests for the <i>Togglable</i> component. Let's add the <i>togglableContent</i> CSS classname to the div that returns the child components.-->
 让我们为<i>Togglable</i>组件写几个测试。让我们把<i>togglableContent</i>的CSS类名添加到返回子组件的div中。

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
 测试结果如下。

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

  test('renders its children', () => {
    screen.findAllByText('togglable content')
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
 每个测试前都会调用_beforeEach_函数，然后渲染<i>Togglable</i>组件并保存返回值的_container_字段。

<!-- The first test verifies that the <i>Togglable</i> component renders its child component-->
 第一个测试验证了<i>Togglable</i>组件渲染了它的子组件。

```
<div className="testDiv" >
  togglable content
</div>
```

<!-- The remaining tests use the [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) method to verify that the child component of the <i>Togglable</i> component is not visible initially, by checking that the style of the <i>div</i> element contains _{ display: 'none' }_. Another test verifies that when the button is pressed the component is visible, meaning that the style for hiding the component <i>is no longer</i> assigned to the component.-->
 其余的测试使用[toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle)方法来验证<i>Togglable</i>组件的子组件最初是不可见的，通过检查<i>div</i>元素的样式是否包含_{ display: ''none' }_。另一个测试验证了当按钮被按下时，组件是可见的，这意味着隐藏组件的样式<i>不再</i>分配给该组件。

<!-- Let's also add a test that can be used to verify that the visible content can be hidden by clicking the second button of the component:-->
 我们还可以添加一个测试，用来验证通过点击组件的第二个按钮是否可以隐藏可见的内容。

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
 我们在之前的测试中已经使用了[用户事件](https://testing-library.com/docs/user-event/intro)的_click_函数来点击按钮。

```js
const user = userEvent.setup()
const button = screen.getByText('show...')
await user.click(button)
```

<!-- We can also simulate text input with <i>userEvent</i>.-->
 我们也可以用<i>userEvent</i>模拟文本输入。

<!-- Let's make a test for the <i>NoteForm</i> component. The code of the component is as follows.-->
 让我们为<i>NoteForm</i>组件做一个测试。该组件的代码如下。

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
 表单通过调用它收到的_createNote_函数来工作，该函数带有新笔记的细节，作为prop。

<!-- The test is as follows:-->
 测试如下。

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

  await user.type(input, 'testing a form...' )
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...' )
})
```

<!-- Tests gets the access to the the input field using the function [getByRole](https://testing-library.com/docs/queries/byrole).-->
 测试使用函数[getByRole](https://testing-library.com/docs/queries/byrole)获得对输入字段的访问。

<!-- Method [type](https://testing-library.com/docs/user-event/utility#type) of the userEvent is used to write text to the input field.-->
使用userEvent的[type](https://testing-library.com/docs/user-event/utility#type)方法，将文本写入输入框。

<!-- The first test expectation ensures, that submitting the form calls the _createNote_ method.-->
 第一个测试期望确保，提交表单时调用_createNote_方法。
<!-- The second expectation checks, that the event handler is called with the right parameters - that a note with the correct content is created when the form is filled.-->
 第二个期望检查，事件处理程序被调用，并带有正确的参数--当表单被填满时，一个带有正确内容的注释被创建。

### About finding the elements

<!-- Let us assume that the form has two input fields-->
 让我们假设表单有两个输入字段

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
 现在，我们的测试用来寻找输入字段的方法

```js
const input = screen.getByRole('textbox')
```

<!-- would cause an error:-->
会导致一个错误。

![](../../images/5/40.png)

<!-- The error message suggests to use <i>getAllByRole</i>. Test could be fixed as follows:-->
 错误信息建议使用<i>getAllByRole</i>。测试可以固定如下。

```js
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...' )
```

<!-- Method <i>getAllByRole</i> now returns an array and the right input field is the first element of the array. However, this approach is a bit suspicious since it relies on the order of the input fields.-->
方法<i>getAllByRole</i>现在返回一个数组，右边的输入栏是数组的第一个元素。然而，这种方法有点可疑，因为它依赖于输入字段的顺序。


<!-- Quite often input fields have a <i>placeholder</i> text that hints user what kind of input is expected. Let us add a placeholder to our form:-->
 很多时候，输入文件都有一个<i>占位符</i>文本，提示用户期待什么样的输入。让我们在我们的表单中添加一个占位符。

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
          placeholder='write here note content' // highlight-line
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

<!-- Now finding the right input field is easy with method [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext):-->
 现在用[getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext)方法可以轻松找到正确的输入字段。

```js
test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write here note content') // highlight-line
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...' )
  userEvent.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...' )
})
```

<!-- The most flexible way of finding elements in tests is the method <i>querySelector</i> of the _container_ object, that is returned by _render_, as was mentioned [earlier in this part](/en/part5/testing_react_apps#searching-for-content-in-a-component). Any CSS selector can be used with this method for searching elements in tests.-->
 在测试中寻找元素的最灵活的方法是_container_对象的<i>querySelector</i>方法，该方法由_render_返回，正如[在本章节的前面](/en/part5/testing_react_apps#searching-for-content-in-a-component)所提到。任何CSS选择器都可以用这个方法来搜索测试中的元素。

<!-- Consider eg. that we would define an unique _id_ to the input field:-->
 考虑一下，例如，我们将为输入字段定义一个唯一的_id_。

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
 输入元素现在可以在测试中被找到，如下所示。

```js
const { container } = render(<NoteForm createNote={createNote} />)

const input = container.querySelector('#note-input')
```

<!-- However we shall stick to the approach of using _getByPlaceholderText_ in the test.-->
 然而我们将坚持在测试中使用_getByPlaceholderText_的方法。

<!-- Let us look to a couple of details before moving on. Let us assume that a component would render test to an HTML-element as follows:-->
 在继续之前，让我们看一下几个细节。让我们假设一个组件将测试渲染到一个HTML-元素，如下所示。

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
测试使用的_getByText_命令没有<i></i>找到这个元素

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

<!-- Command _getByText_ looks for an element that has exactly the **same text** that it has as parameter, and nothing more. If we want to look for element that <i>contains</i> the text, we could use a extra option:-->
命令_getByText_寻找一个元素，该元素具有与它的参数**相同的文本**，仅此而已。如果我们想寻找<i>包含</i>文本的元素，我们可以使用一个额外的选项。

```js
const element = screen.getByText(
  'Does not work anymore :(', { exact: false }
)
```

<!-- or we could use the command _findByText_:-->
 或者我们可以使用_findByText_命令。

```js
const element = await screen.findByText('Does not work anymore :(')
```

<!-- It is important to notice that unlike the other _ByText_ commands, _findByText_ returns a promise!-->
 需要注意的是，与其他的_ByText_命令不同，_findByText_会返回一个承诺!

<!-- There are situation where yet another form of the command _queryByText_ is useful. The command returns the element but <i>it does not cause an exception</i> if the element is not found.-->
 在有些情况下，另一种形式的命令_queryByText_是有用的。该命令返回元素，但如果没有找到该元素，它不会引起一个异常</i>。

<!-- We could eg. use the command to ensure that something <i>is not rendered</i> to the component:-->
 例如，我们可以用这个命令来确保某些东西<i>没有被渲染</i>到组件上。

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
 我们可以很容易地通过命令运行测试来找出我们测试的[覆盖率](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting)。

```js
CI=true npm test -- --coverage
```

![](../../images/5/18ea.png)

<!-- A quite primitive HTML report will be generated to the <i>coverage/lcov-report</i> directory.-->
 一个相当原始的HTML报告将被生成到<i>coverage/lcov-report</i>目录中。
<!-- The report will tell us the lines of untested code in each component:-->
 该报告将告诉我们每个组件中未测试的代码行。

![](../../images/5/19ea.png)

<!-- You can find the code for our current application in its entirety in the <i>part5-8</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-8).-->
 你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part2-notes/tree/part5-8)的<i>part5-8</i>分支中找到我们当前应用的全部代码。
</div>

<div class="tasks">

### Exercises 5.13.-5.16.

#### 5.13: Blog list tests, step1

<!-- Make a test which checks that the component displaying a blog renders the blog's title and author, but does not render its url or number of likes by default.-->
 做一个测试，检查显示博客的组件是否显示博客的标题和作者，但默认情况下不显示它的网址和喜欢数。

<!-- Add CSS-classes to the component to help the testing as necessary.-->
 为组件添加CSS类，以帮助进行必要的测试。

#### 5.14: Blog list tests, step2

<!-- Make a test which checks that the blog's url and number of likes are shown when the button controlling the shown details has been clicked.-->
 做一个测试，检查当控制显示细节的按钮被点击时，博客的网址和喜欢数是否显示出来。

#### 5.15: Blog list tests, step3

<!-- Make a test which ensures that if the <i>like</i> button is clicked twice, the event handler the component received as props is called twice.-->
 做一个测试，确保如果<i>喜欢</i>按钮被点击两次，该组件作为prop收到的事件处理程序被调用两次。

#### 5.16: Blog list tests, step4

<!-- Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.-->
 为新的博客表单做一个测试。这个测试应该检查，当一个新的博客被创建时，表单调用它作为prop收到的事件处理程序的正确细节。

</div>

<div class="content">

### Frontend integration tests

<!-- In the previous part of the course material, we wrote integration tests for the backend that tested its logic and connected the database through the API provided by the backend. When writing these tests, we made the conscious decision not to write unit tests, as the code for that backend is fairly simple, and it is likely that bugs in our application occur in more complicated scenarios than unit tests are well suited for.-->
 在教材的前一部分，我们为后端写了集成测试，测试其逻辑，并通过后端提供的API连接数据库。在写这些测试时，我们有意识地决定不写单元测试，因为该后端代码相当简单，而我们的应用中的错误很可能发生在比单元测试更复杂的情况下。

<!-- So far all of our tests for the frontend have been unit tests that have validated the correct functioning of individual components. Unit testing is useful at times, but even a comprehensive suite of unit tests is not enough to validate that the application works as a whole.-->
 到目前为止，我们对前台的所有测试都是单元测试，验证了各个组件的正确功能。单元测试有时是有用的，但即使是一套全面的单元测试也不足以验证应用作为一个整体工作。

<!-- We could also make integration tests for the frontend. Integration testing tests the collaboration of multiple components. It is considerably more difficult than unit testing, as we would have to for example mock data from the server.-->
 我们也可以为前端做集成测试。集成测试是对多个组件的协作进行测试。它比单元测试要困难得多，因为我们必须从服务器上模拟数据。
<!-- We chose to concentrate on making end to end tests in order to test the whole application. We will work on the end to end tests in the last chapter of this part.-->
 我们选择专注于做端到端的测试，以测试整个应用。我们将在这部分的最后一章中进行端到端的测试。

### Snapshot testing

<!-- Jest offers a completely different alternative to "traditional" testing called [snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html) testing. The interesting feature of snapshot testing is that developers do not need to define any tests themselves, it is simply enough to adopt snapshot testing.-->
 Jest提供了一个与 "传统 "测试完全不同的选择，叫做[快照](https://facebook.github.io/jest/docs/en/snapshot-testing.html)测试。快照测试的有趣特点是，开发人员不需要自己定义任何测试，只需采用快照测试即可。

<!-- The fundamental principle is to compare the HTML code defined by the component after it has changed to the HTML code that existed before it was changed.-->
基本原理是将组件改变后定义的HTML代码与改变前的HTML代码进行比较。

<!-- If the snapshot notices some change in the HTML defined by the component, then either it is new functionality or a "bug" caused by accident. Snapshot tests notify the developer if the HTML code of the component changes. The developer has to tell Jest if the change was desired or undesired. If the change to the HTML code is unexpected, it strongly implies a bug, and the developer can become aware of these potential issues easily thanks to snapshot testing.-->
 如果快照注意到组件定义的HTML有一些变化，那么要么是新功能，要么是意外造成的 "错误"。如果组件的HTML代码发生变化，快照测试会通知开发者。开发者必须告诉Jest，这种变化是需要的还是不需要的。如果HTML代码的变化是出乎意料的，那就强烈地暗示了一个bug，由于快照测试，开发者可以很容易地意识到这些潜在的问题。

</div>
