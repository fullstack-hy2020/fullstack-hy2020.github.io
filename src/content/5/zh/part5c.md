---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: zh
---

<div class="tasks">

2024年3月3日，本部分使用的测试库从Jest更改为Vitest。如果您已经开始使用Jest进行本部分的工作，您可以在[这里](https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/blob/02d8be28b1c9190f48976fbbd2435b63261282df/src/content/5/zh/part5c.md)查看旧内容。

</div>

<div class="content">

有许多不同的方法可以测试React应用程序。让我们来看看它们。

本课程以前使用了Facebook开发的[Jest](http://jestjs.io/)库来测试React组件。我们现在使用来自Vite开发人员的新一代测试工具，称为[Vitest](https://vitest.dev/)。除了配置之外，这两个库提供了相同的编程接口，因此在测试代码中几乎没有任何区别。

让我们首先安装Vitest和模拟Web浏览器的[jsdom](https://github.com/jsdom/jsdom)库：

```
npm install --save-vitest vitest jsdom
```

除了Vitest之外，我们还需要另一个测试库，用于帮助我们渲染组件进行测试。目前最好的选择是[react-testing-library](https://github.com/testing-library/react-testing-library)，它在最近的时间内迅速增长了人气。还值得使用[jest-dom](https://github.com/testing-library/jest-dom)库扩展测试的表达能力。

让我们使用以下命令安装这些库：

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

<!-- Before we can do the first test, we need some configurations. -->
在我们进行第一个测试之前，我们需要进行一些配置。

<!-- We add a script to the <i>package.json</i> file to run the tests: -->
我们在<i>package.json</i>文件中添加一个脚本来运行测试：

```js 
{
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...
}
```

<!-- Let's create a file _testSetup.js_ in the project root with the following content -->
让我们在项目根目录中创建一个名为_testSetup.js_的文件，内容如下：

```js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

<!-- Now, after each test, the function _cleanup_ is performed that resets the jsdom that is simulating the browser. -->
现在，在每个测试之后，将执行_reset_函数，该函数重置了模拟浏览器的jsdom。

<!-- Expand the _vite.config.js_ file as follows -->
将_vite.config.js_文件扩展如下：

```js
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
})
```

<!-- With _globals: true_, there is no need to import keywords such as _describe_, _test_ and _expect_ into the tests. -->
通过设置 _globals: true_ ，我们无需在测试中导入关键字，如 _describe_ 、 _test_ 和 _expect_ 。

<!-- Let's first write tests for the component that is responsible for rendering a note: -->
让我们首先为负责渲染注释的组件编写测试：

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

<!-- Notice that the <i>li</i> element has the value <i>note</i> for the [CSS](https://react.dev/learn#adding-styles) attribute className, that could be used to access the component in our tests. -->
请注意，_li_元素的[CSS](https://react.dev/learn#adding-styles)属性className的值为_note_，可以用于在我们的测试中访问该组件。

### Rendering the component for tests

<!-- We will write our test in the <i>src/components/Note.test.js</i> file, which is in the same directory as the component itself. -->
我们将在与组件本身位于同一目录的 _src/components/Note.test.js_ 文件中编写测试。

<!-- The first test verifies that the component renders the contents of the note: -->
第一个测试验证组件是否呈现了注释的内容：

```js
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

<!-- After the initial configuration, the test renders the component with the [render](https://testing-library.com/docs/react-testing-library/api#render) function provided by the react-testing-library: -->
在初始配置之后，测试使用了由react-testing-library提供的 [render](https://testing-library.com/docs/react-testing-library/api#render) 函数来渲染组件：

```js
render(<Note note={note} />)
```

<!-- Normally React components are rendered to the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). The render method we used renders the components in a format that is suitable for tests without rendering them to the DOM. -->
通常，React组件会渲染到 [DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model) 中。我们使用的 render 方法以适合测试的格式渲染组件，而无需将其渲染到DOM中。

<!-- We can use the object [screen](https://testing-library.com/docs/queries/about#screen) to access the rendered component. We use screen's method [getByText](https://testing-library.com/docs/queries/bytext) to search for an element that has the note content and ensure that it exists: -->
我们可以使用 [screen](https://testing-library.com/docs/queries/about#screen) 对象来访问渲染的组件。我们使用screen的 [getByText](https://testing-library.com/docs/queries/bytext) 方法来搜索具有注释内容的元素，并确保它存在：

```js
  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
```

<!-- The existence of an element is checked using Vitest's [expect](https://vitest.dev/api/expect.html#expect) command. Expect generates an assertion from its parameter, the validity of which can be tested using various condition functions. Now we used [toBeDefined](https://vitest.dev/api/expect.html#tobedefined) which tests whether the _element_ parameter of expect exists. -->
使用Vitest的 [expect](https://vitest.dev/api/expect.html#expect) 命令来检查元素的存在性。expect从其参数生成断言，可以使用各种条件函数来测试其有效性。现在，我们使用了 [toBeDefined](https://vitest.dev/api/expect.html#tobedefined) ，它测试expect的 _element_ 参数是否存在。

<!-- Run the test with command _npm test_: -->
使用命令_npm test_运行测试：

```js
$ npm test

> notes-frontend@0.0.0 test
> vitest


 DEV  v1.3.1 /Users/mluukkai/opetus/2024-fs/part3/notes-frontend

 ✓ src/components/Note.test.jsx (1)
   ✓ renders content

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:05:37
   Duration  812ms (transform 31ms, setup 220ms, collect 11ms, tests 14ms, environment 395ms, prepare 70ms)


 PASS  Waiting for file changes...
```

<!-- Eslint complains about the keywords _test_ and _expect_ in the tests. The problem can be solved by installing [eslint-plugin-vitest-globals](https://www.npmjs.com/package/eslint-plugin-vitest-globals): -->
Eslint在测试中抱怨关键字_test_和_expect_。可以通过安装_eslint-plugin-vitest-globals_来解决这个问题：

```
npm install --save-dev eslint-plugin-vitest-globals
```

<!-- and enable the plugin by editing the _.eslint.cjs_ file as follows:  -->
然后通过编辑_.eslint.cjs_文件来启用插件，如下所示：

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    "vitest-globals/env": true // highlight-line
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:vitest-globals/recommended', // highlight-line
  ],
  // ...
}
```

### Test file location

<!-- In React there are (at least) [two different conventions](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) for the test file's location. We created our test files according to the current standard by placing them in the same directory as the component being tested.

The other convention is to store the test files "normally" in a separate _test_ directory. Whichever convention we choose, it is almost guaranteed to be wrong according to someone's opinion.

I do not like this way of storing tests and application code in the same directory. The reason we choose to follow this convention is that it is configured by default in applications created by Vite or create-react-app. -->
在 React 中，测试文件的位置至少有 [两种不同的约定](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850)。我们按照当前标准创建了我们的测试文件，将它们放在与被测组件相同的目录中。

另一个约定是将测试文件“正常”存储在单独的 _test_ 目录中。无论我们选择哪种约定，几乎可以肯定会有人认为是错误的。

我不喜欢将测试和应用程序代码存储在同一目录中的这种方式。我们选择遵循此约定的原因是它在由 Vite 或 create-react-app 创建的应用程序中默认配置。

### Searching for content in a component

<!-- The react-testing-library package offers many different ways of investigating the content of the component being tested. In reality, the _expect_ in our test is not needed at all: -->
react-testing-library 包提供了多种不同的方法来调查被测组件的内容。实际上，我们的测试中的 _expect_ 根本不需要：

```js
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

<!-- Test fails if _getByText_ does not find the element it is looking for. -->
如果 _getByText_ 没有找到它正在查找的元素，测试将失败。

<!-- We could also use [CSS-selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) to find rendered elements by using the method [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) of the object [container](https://testing-library.com/docs/react-testing-library/api/#container-1) that is one of the fields returned by the render: -->
们还可以使用 [CSS 选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors) 通过使用 [querySelector](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector) 方法来查找呈现的元素对象 [container](https://testing-library.com/docs/react-testing-library/api/#container-1)，这是 render 返回的字段之一：

```js
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

<!-- **NB:** A more consistent way of selecting elements is using a [data attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) that is specifically defined for testing purposes. Using _react-testing-library_, we can leverage the [getByTestId](https://testing-library.com/docs/queries/bytestid/) method to select elements with a specified _data-testid_ attribute. -->
**注意：**选择元素的更一致方法是使用 [数据属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*），该属性专门为测试目的而定义。使用 _react-testing-library_，我们可以利用 [getByTestId](https://testing-library.com/docs/queries/bytestid/) 方法来选择具有指定 _data-testid_ 属性的元素。

### Debugging tests

<!-- We typically run into many different kinds of problems when writing our tests. -->
在编写测试时，我们通常会遇到许多不同类型的问题。

<!-- Object _screen_ has method [debug](https://testing-library.com/docs/dom-testing-library/api-debugging#screendebug) that can be used to print the HTML of a component to the terminal. If we change the test as follows: -->
对象 _screen_ 具有方法 [debug](https://testing-library.com/docs/dom-testing-library/api-debugging#screendebug)，可用于将组件的 HTML 打印到终端。如果我们按如下方式更改测试：

```js
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

<!-- the HTML gets printed to the console: -->
HTML被打印到控制台：

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

<!-- It is also possible to use the same method to print a wanted element to console: -->
也可以使用相同的方法将所需元素打印到控制台：

```js
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

<!-- Now the HTML of the wanted element gets printed: -->
现在打印出所需元素的HTML：

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

<!-- In addition to displaying content, the <i>Note</i> component also makes sure that when the button associated with the note is pressed, the _toggleImportance_ event handler function gets called. -->
除了显示内容之外，<i>Note</i> 组件还确保在按下与注释关联的按钮时调用 _toggleImportance_ 事件处理程序函数。

<!-- Let us install a library [user-event](https://testing-library.com/docs/user-event/intro) that makes simulating user input a bit easier: -->
让我们安装一个库 [user-event](https://testing-library.com/docs/user-event/intro)，它使模拟用户输入变得更容易：

```bash
npm install --save-dev @testing-library/user-event
```

<!-- Testing this functionality can be accomplished like this: -->
可以像这样测试此功能：

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // highlight-line
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  
  const mockHandler = vi.fn()  // highlight-line

  render(
    <Note note={note} toggleImportance={mockHandler} />  // highlight-line
  )

  const user = userEvent.setup()  // highlight-line
  const button = screen.getByText('make not important')  // highlight-line
  await user.click(button)  // highlight-line

  expect(mockHandler.mock.calls).toHaveLength(1)  // highlight-line
})
```

<!-- There are a few interesting things related to this test. The event handler is a [mock](https://vitest.dev/api/mock) function defined with Vitest: -->
此测试有一些与之相关的有趣之处。事件处理程序是一个使用 Vitest 定义的 [mock](https://vitest.dev/api/mock) 函数：

```js
const mockHandler = vi.fn()
```

<!-- A [session](https://testing-library.com/docs/user-event/setup/) is started to interact with the rendered component: -->
[session](https://testing-library.com/docs/user-event/setup/) 启动以与呈现的组件进行交互：

```js
const user = userEvent.setup()
```

<!-- The test finds the button <i>based on the text</i> from the rendered component and clicks the element: -->
测试基于呈现组件的<i>文本</i>找到按钮并单击元素：

```js
const button = screen.getByText('make not important')
await user.click(button)
```

<!-- Clicking happens with the method [click](https://testing-library.com/docs/user-event/convenience/#click) of the userEvent-library. -->
单击使用 userEvent 库的 [click](https://testing-library.com/docs/user-event/convenience/#click) 方法进行。

<!-- The expectation of the test uses [toHaveLength](https://vitest.dev/api/expect.html#tohavelength) to verify that the <i>mock function</i> has been called exactly once: -->
测试的期望使用 [toHaveLength](https://vitest.dev/api/expect.html#tohavelength) 来验证<i>mock 函数</i>已被调用一次：

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

<!-- The calls of the mock function are saved to the array [mock.calls](https://vitest.dev/api/mock#mock-calls) within the mock function object. -->
[Mock 对象和函数](https://en.wikipedia.org/wiki/Mock_object) 是测试中常用的 [stub](https://en.wikipedia.org/wiki/Method_stub) 组件，用于替换被测组件的依赖项。Mocks 可以返回硬编码的响应，并验证 mock 函数被调用的次数以及使用什么参数。

<!-- [Mock objects and functions](https://en.wikipedia.org/wiki/Mock_object) are commonly used [stub](https://en.wikipedia.org/wiki/Method_stub) components in testing that are used for replacing dependencies of the components being tested. Mocks make it possible to return hardcoded responses, and to verify the number of times the mock functions are called and with what parameters. -->
在我们的示例中，mock 函数是一个完美的选择，因为它可以很容易地用于验证该方法被调用一次。

<!-- In our example, the mock function is a perfect choice since it can be easily used for verifying that the method gets called exactly once. -->
让我们为<i>Togglable</i>组件编写一些测试。让我们将<i>togglableContent</i> CSS 类名添加到返回子组件的 div。

### Tests for the <i>Togglable</i> component

<!-- Let's write a few tests for the <i>Togglable</i> component. Let's add the <i>togglableContent</i> CSS classname to the div that returns the child components. -->
让我们为<i>Togglable</i>组件编写一些测试。让我们将<i>togglableContent</i> CSS 类名添加到返回子组件的 div。

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

<!-- The tests are shown below: -->
测试如下所示：

```js

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

<!-- The _beforeEach_ function gets called before each test, which then renders the <i>Togglable</i> component and saves the field _container_ of the returned value. -->
_beforeEach_ 函数在每个测试之前调用，然后渲染<i>Togglable</i>组件并保存返回值的 _container_ 字段。

<!-- The first test verifies that the <i>Togglable</i> component renders its child component -->
第一个测试验证<i>Togglable</i>组件是否渲染其子组件

```js
<div className="testDiv">
  togglable content
</div>
```

<!-- The remaining tests use the [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) method to verify that the child component of the <i>Togglable</i> component is not visible initially, by checking that the style of the <i>div</i> element contains _{ display: 'none' }_. Another test verifies that when the button is pressed the component is visible, meaning that the style for hiding it <i>is no longer</i> assigned to the component. -->
其余的测试使用 [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) 方法来验证<i>Togglable</i>组件的子组件最初不可见，方法是检查<i>div</i>元素的样式是否包含 _{ display: 'none' }_。另一个测试验证当按下按钮时组件可见，这意味着隐藏它的样式<i>不再</i>分配给组件。

<!-- Let's also add a test that can be used to verify that the visible content can be hidden by clicking the second button of the component: -->
我们还可以添加一个测试，该测试可用于验证可以通过单击组件的第二个按钮来隐藏可见的内容：

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

<!-- We already used the _click_ function of the [user-event](https://testing-library.com/docs/user-event/intro) in our previous tests to click buttons. -->
我们在之前的测试中已经使用了 [user-event](https://testing-library.com/docs/user-event/intro) 的 _click_ 函数来单击按钮。

```js
const user = userEvent.setup()
const button = screen.getByText('show...')
await user.click(button)
```

<!-- We can also simulate text input with <i>userEvent</i>. -->
我们还可以使用<i>userEvent</i>模拟文本输入。

<!-- Let's make a test for the <i>NoteForm</i> component. The code of the component is as follows. -->
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
      important: true,
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

<!-- The form works by calling the function received as props _createNote_, with the details of the new note. -->
该表单通过调用作为道具 _createNote_ 接收到的函数来工作，其中包含新便笺的详细信息。

<!-- The test is as follows: -->
测试如下：

```js
import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
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

<!-- Tests get access to the input field using the function [getByRole](https://testing-library.com/docs/queries/byrole). -->
测试使用函数 [getByRole](https://testing-library.com/docs/queries/byrole) 访问输入字段。

<!-- The method [type](https://testing-library.com/docs/user-event/utility#type) of the userEvent is used to write text to the input field. -->
userEvent 的 [type](https://testing-library.com/docs/user-event/utility#type) 方法用于向输入字段写入文本。

<!-- The first test expectation ensures that submitting the form calls the _createNote_ method. -->
<!-- The second expectation checks that the event handler is called with the right parameters - that a note with the correct content is created when the form is filled. -->
第一个测试期望确保提交表单会调用 _createNote_ 方法。
第二个期望检查事件处理程序是否使用正确的参数调用——即在填写表单时创建具有正确内容的便笺。

<!-- It's worth noting that the good old _console.log_ works as usual in the tests. For example, if you want to see what the calls stored by the mock-object look like, you can do the following -->
值得注意的是，好的旧 _console.log_ 在测试中照常工作。例如，如果您想查看 mock 对象存储的调用是什么样的，可以执行以下操作

```js
test('<NoteForm /> updates parent state and calls onSubmit', async() => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  console.log(createNote.mock.calls) // highlight-line
})
```

In the middle of running the tests, the following is printed
在运行测试的过程中，打印以下内容

```
[ [ { content: 'testing a form...', important: true } ] ]
```

### About finding the elements

<!-- Let us assume that the form has two input fields -->
让我们假设表单有两个输入字段

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div className="formDiv">
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

<!-- Now the approach that our test uses to find the input field -->
现在我们的测试用于查找输入字段的方法

```js
const input = screen.getByRole('textbox')
```

<!-- would cause an error: -->
会导致错误：

![node error that shows two elements with textbox since we use getByRole](../../images/5/40.png)

<!-- The error message suggests using <i>getAllByRole</i>. The test could be fixed as follows: -->
错误消息建议使用<i>getAllByRole</i>。测试可以修复如下：

```js
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...')
```

<!-- Method <i>getAllByRole</i> now returns an array and the right input field is the first element of the array. However, this approach is a bit suspicious since it relies on the order of the input fields. -->
方法<i>getAllByRole</i>现在返回一个数组，正确的输入字段是数组的第一个元素。然而，这种方法有点可疑，因为它依赖于输入字段的顺序。

<!-- Quite often input fields have a <i>placeholder</i> text that hints user what kind of input is expected. Let us add a placeholder to our form: -->
通常输入字段有一个<i>占位符</i>文本，提示用户期望哪种类型的输入。让我们在表单中添加一个占位符：

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div className="formDiv">
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

<!-- Now finding the right input field is easy with the method [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext): -->
现在使用 [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext) 方法可以轻松找到正确的输入字段：

```js
test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />) 

  const input = screen.getByPlaceholderText('write note content here') // highlight-line 
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...')
  userEvent.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

<!-- The most flexible way of finding elements in tests is the method <i>querySelector</i> of the _container_ object, which is returned by _render_, as was mentioned [earlier in this part](/en/part5/testing_react_apps#searching-for-content-in-a-component). Any CSS selector can be used with this method for searching elements in tests. -->
在测试中查找元素的最灵活的方法是<i>querySelector</i>方法，它是 _container_ 对象的方法，由 _render_ 返回，如 [本部分前面](/en/part5/testing_react_apps#searching-for-content-in-a-component) 所述。任何 CSS 选择器都可以与此方法一起用于搜索测试中的元素。

<!-- Consider eg. that we would define a unique _id_ to the input field: -->
例如，考虑我们为输入字段定义一个唯一的 _id_：

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div className="formDiv">
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

<!-- The input element could now be found in the test as follows: -->
现在可以在测试中找到输入元素，如下所示：
 
```js
const { container } = render(<NoteForm createNote={createNote} />)

const input = container.querySelector('#note-input')
```

<!-- However, we shall stick to the approach of using _getByPlaceholderText_ in the test. -->
但是，我们将坚持在测试中使用 _getByPlaceholderText_ 的方法。

<!-- Let us look at a couple of details before moving on. Let us assume that a component would render text to an HTML element as follows: -->
在继续之前，让我们看一些细节。让我们假设一个组件会将文本渲染到 HTML 元素，如下所示：

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

<!-- the _getByText_ method that the test uses does <i>not</i> find the element -->
测试使用的 _getByText_ 方法<i>找不到</i>元素

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

<!-- The _getByText_ method looks for an element that has the **same text** that it has as a parameter, and nothing more. If we want to look for an element that <i>contains</i> the text, we could use an extra option: -->
_getByText_ 方法查找具有**相同文本**的元素作为其参数，仅此而已。如果我们想查找<i>包含</i>文本的元素，我们可以使用额外的选项：

```js
const element = screen.getByText(
  'Does not work anymore :(', { exact: false }
)
```

<!-- or we could use the _findByText_ method: -->
或者我们可以使用 _findByText_ 方法：

```js
const element = await screen.findByText('Does not work anymore :(')
```

<!-- It is important to notice that, unlike the other _ByText_ methods, _findByText_ returns a promise! -->
重要的是要注意，与其他 _ByText_ 方法不同，_findByText_ 返回一个 Promise！

<!-- There are situations where yet another form of the _queryByText_ method is useful. The method returns the element but <i>it does not cause an exception</i> if it is not found. -->
在某些情况下，_queryByText_ 方法的另一种形式很有用。该方法返回元素，但<i>如果没有找到它，则不会引发异常</i>。

<!-- We could eg. use the method to ensure that something <i>is not rendered</i> to the component: -->
例如，我们可以使用该方法来确保<i>没有</i>向组件呈现某些内容：

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

<!-- We can easily find out the [coverage](https://vitest.dev/guide/coverage.html#coverage) of our tests by running them with the command. -->
我们可以通过使用以下命令运行测试来轻松找出我们测试的[覆盖率](https://vitest.dev/guide/coverage.html#coverage)。

```js
npm test -- --coverage
```

<!-- The first time you run the command, Vitest will ask you if you want to install the required library _@vitest/coverage-v8_. Install it, and run the command again: -->
当你第一次运行该命令时，Vitest 会询问你是否要安装必需的库 _@vitest/coverage-v8_。安装它，然后再次运行该命令：

![terminal output of test coverage](../../images/5/18new.png)

<!-- A HTML report will be generated to the <i>coverage</i> directory.
The report will tell us the lines of untested code in each component: -->
HTML 报告将生成到<i>coverage</i>目录。
该报告将告诉我们每个组件中未测试代码的行：

![HTML report of the test coverage](../../images/5/19newer.png)

<!-- You can find the code for our current application in its entirety in the <i>part5-8</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-8). -->
你可以在 [这个 GitHub 仓库](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-8) 的<i>part5-8</i>分支中找到我们当前应用程序的完整代码。

</div>

<div class="tasks">

### Exercises 5.13.-5.16.

#### 5.13: Blog List Tests, step 1

Make a test, which checks that the component displaying a blog renders the blog's title and author, but does not render its URL or number of likes by default.
<!-- 进行一项测试，检查显示博客的组件是否渲染了博客的标题和作者，但默认情况下不渲染其 URL 或点赞数。 -->

<!-- Add CSS classes to the component to help the testing as necessary. -->
根据需要向组件添加 CSS 类以帮助测试。

#### 5.14: Blog List Tests, step 2

<!-- Make a test, which checks that the blog's URL and number of likes are shown when the button controlling the shown details has been clicked. -->
进行一项测试，检查在单击控制显示详情的按钮时显示博客的 URL 和点赞数。

#### 5.15: Blog List Tests, step 3

<!-- Make a test, which ensures that if the <i>like</i> button is clicked twice, the event handler the component received as props is called twice. -->
进行一项测试，以确保如果<i>点赞</i>按钮被单击两次，则组件作为道具接收的事件处理程序将被调用两次。

#### 5.16: Blog List Tests, step 4

<!-- Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created. -->
为新博客表单进行一项测试。该测试应检查表单在创建新博客时使用正确的详细信息调用它作为道具接收的事件处理程序。

</div>

<div class="content">

### Frontend integration tests

<!-- In the previous part of the course material, we wrote integration tests for the backend that tested its logic and connected the database through the API provided by the backend. When writing these tests, we made the conscious decision not to write unit tests, as the code for that backend is fairly simple, and it is likely that bugs in our application occur in more complicated scenarios than unit tests are well suited for. -->
在课程材料的上一部分中，我们为后端编写了集成测试，该测试测试了它的逻辑并通过后端提供的 API 连接数据库。在编写这些测试时，我们有意识地决定不编写单元测试，因为该后端代码相当简单，并且我们应用程序中的错误很可能发生在比单元测试更适合的更复杂的情况下。

<!-- So far all of our tests for the frontend have been unit tests that have validated the correct functioning of individual components. Unit testing is useful at times, but even a comprehensive suite of unit tests is not enough to validate that the application works as a whole. -->
到目前为止，我们对前端的所有测试都是单元测试，这些测试验证了各个组件的正确功能。单元测试有时很有用，但即使是全面的单元测试套件也不足以验证应用程序作为一个整体是否正常工作。

<!-- We could also make integration tests for the frontend. Integration testing tests the collaboration of multiple components. It is considerably more difficult than unit testing, as we would have to for example mock data from the server.
We chose to concentrate on making end-to-end tests to test the whole application. We will work on the end-to-end tests in the last chapter of this part. -->
我们还可以对前端进行集成测试。集成测试测试了多个组件的协作。这比单元测试困难得多，因为我们必须模拟来自服务器的数据。
我们选择专注于进行端到端测试来测试整个应用程序。我们将在本部分的最后一章中进行端到端测试。

### Snapshot testing

<!-- Vitest offers a completely different alternative to "traditional" testing called [snapshot](https://vitest.dev/guide/snapshot) testing. The interesting feature of snapshot testing is that developers do not need to define any tests themselves, it is simple enough to adopt snapshot testing. -->
Vitest 提供了一种与“传统”测试完全不同的替代方案，称为[快照](https://vitest.dev/guide/snapshot)测试。快照测试的有趣之处在于，开发人员自己不需要定义任何测试，采用快照测试很简单。

<!-- The fundamental principle is to compare the HTML code defined by the component after it has changed to the HTML code that existed before it was changed. -->
基本原则是将组件更改后定义的 HTML 代码与更改前存在的 HTML 代码进行比较。

<!-- If the snapshot notices some change in the HTML defined by the component, then either it is new functionality or a "bug" caused by accident. Snapshot tests notify the developer if the HTML code of the component changes. The developer has to tell Jest if the change was desired or undesired. If the change to the HTML code is unexpected, it strongly implies a bug, and the developer can become aware of these potential issues easily thanks to snapshot testing. -->
如果快照注意到组件定义的 HTML 中发生了一些变化，那么它要么是新功能，要么是意外造成的“错误”。快照测试会通知开发人员组件的 HTML 代码是否发生变化。开发人员必须告诉 Jest 更改是需要的还是不需要的。如果对 HTML 代码的更改是意外的，那么它强烈暗示存在错误，并且开发人员可以轻松地通过快照测试了解这些潜在问题。

</div>
