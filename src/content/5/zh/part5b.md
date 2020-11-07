---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: zh
---

<div class="content">

### Displaying the login form only when appropriate
【在合适的时候展示登录表单】

<!-- Let's modify the application so that the login form is not displayed by default: -->
让我们修改应用，让登录表单在默认情况下不显示

![](../../images/5/10e.png)

<!-- The login form appears when the user presses the <i>login</i> button: -->
而当用户点击登录按钮时，登录表单再出现

![](../../images/5/11e.png)

<!-- The user can close the login form by clicking the <i>cancel</i> button. -->
用户可以通过单击 cancel 按钮关闭登录表单

<!-- Let's start by extracting the login form into its own component: -->
我们首先将登录组件解耦出来：

```js
import React from 'react'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
```

<!-- The state and all the functions related to it are defined outside of the component and are passed to the component as props. -->

状态以及所有相关的函数都在组件外进行定义，并作为属性传递给组件。

<!-- Notice that the props are assigned to variables through <i>destructuring</i>, which means that instead of writing: -->

注意，属性是通过变量解构出来的，这意味着不是如下这种方式编写：

```js
const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
        <div>
          username
          <input
            value={props.username}
            onChange={props.handleChange}
            name="username"
          />
        </div>
        // ...
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

<!-- where the properties of the _props_ object are accessed through e.g. _props.handleSubmit_, the properties are assigned directly to their own variables. -->

例如当访问 _props_ 对象的 _props.handleSubmit_ 属性时，属性被直接赋值给它们自己的变量。

<!-- One fast way of implementing the functionality is to change the _loginForm_ function of the <i>App</i> component like so: -->

一个快速的实现方式是改变 <i>App</i> 组件的 loginForm 函数，如下所示:

```js
const App = () => {
  const [loginVisible, setLoginVisible] = useState(false) // highlight-line

  // ...

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  // ...
}
```

<!-- The <i>App</i> components state now contains the boolean <i>loginVisible</i>, that defines if the login form should be shown to the user or not. -->
<i>App</i> 组件状态当前包含了 <i>loginVisible</i> 这个布尔值，定义了登录表单是否应当展示给用户。

<!-- The value of loginVisible is toggled with two buttons. Both buttons have their event handlers defined directly in the component: -->
loginVisible 可以通过两个按钮切换，每个按钮都有自己的事件处理函数，这些函数直接定义在组件中。 

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```

<!-- The visibility of the component is defined by giving the component an [inline](/zh/part2/给_react应用加点样式#inline-styles) style rule, where the value of the [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property is <i>none</i> if we do not want the component to be displayed: -->

组件是否可见被定义在了一个内联样式中[inline](/zh/part2/给_react应用加点样式#inline-styles) ，即[display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) 属性值是 <i>none</i>的时候，组件就看不到了：

```js
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // button
</div>

<div style={showWhenVisible}>
  // button
</div>
```

<!-- We are once again using the "question mark" ternary operator. If _loginVisible_ is <i>true</i>, then the CSS rule of the component will be: -->
我们再次使用三元运算符。如果 _loginVisible_ 是 <i>true</i>，组件的 CSS 规则为：

```css
display: 'none';
```

<!-- If _loginVisible_ is <i>false</i>, then <i>display</i> will not receive any value related to the visibility of the component. -->

如果 _loginVisible_ 是 <i>false</i>， <i>display</i> 不会接受任何与组件可见性相关的值。

### The components children, aka. props.children
【组件的 children，又叫 props.children】

<!-- The code related to managing the visibility of the login form could be considered to be its own logical entity, and for this reason it would be good to extract it from the <i>App</i> component into its own separate component. -->

用于控制登录表单是否可见的代码，应当被视作它自己的逻辑实体，出于这个原因，它最好从 <i>App</i> 组件中解耦到自己的组件中。

<!-- Our goal is to implement a new <i>Togglable</i> component that can be used in the following way: -->
我们的目标是实现一个新的 <i>Togglable</i> 组件，按照如下方式进行使用：

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

<!-- The way that the component is used is slightly different from our previous components. The component has both an opening and a closing tags which surround a <i>LoginForm</i> component. In React terminology <i>LoginForm</i> is a child component of <i>Togglable</i>. -->

这与我们之前的组件使用方法有一些不同。包含打开和关闭标签的组件将 <i>LoginForm</i> 包含在了里面。用 React 的术语来说， <i>LoginForm</i> 组件是 <i>Togglable</i> 的子组件。

<!-- We can add any React elements we want between the opening and closing tags of <i>Togglable</i>, like this for example: -->
任何我们想要打开或关闭的组件都可以通过 <i>Togglable</i> 进行包裹，例如：

```js
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```

<!-- The code for the <i>Togglable</i> component is shown below: -->
<i>Togglable</i> 组件的代码如下：

```js
import React, { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

<!-- The new and interesting part of the code is [props.children](https://reactjs.org/docs/glossary.html#propschildren), that is used for referencing the child components of the component. The child components are the React elements that we define between the opening and closing tags of a component. -->

这个新的且比较有趣的代码就是 [props.children](https://reactjs.org/docs/glossary.html#propschildren)， 它用来引用组件的子组件。子组件就是我们想要控制开启和关闭的 React 组件。

<!-- This time the children are rendered in the code that is used for rendering the component itself: -->
这一次，子组件被渲染到了用于渲染组件本身的代码中：

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

<!-- Unlike the "normal" props we've seen before, <i>children</i> is automatically added by React and always exists. If a component is defined with an automatically closing _/>_ tag, like this: -->
并不像之前我们见到的使用的普通属性， <i>children</i>被 React 自动添加了，并始终存在，只要这个组件定义了关闭标签 _/>_

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

<!-- Then <i>props.children</i> is an empty array. -->
这时 <i>props.children</i> 是一个空的数组。

<!-- The <i>Togglable</i> component is reusable and we can use it to add similar visibility toggling functionality to the form that is used for creating new notes. -->
<i>Togglable</i> 组件可被重用，我们可以用它创建新的切换可见性的功能，如对添加 Note 的表单添加类似的功能。

<!-- Before we do that, let's extract the form for creating notes into its own component: -->
在这之前，我们把创建 Note 的表单解耦到自己的组件中。

```js
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

<!-- Next let's define the form component inside of a <i>Togglable</i> component: -->
下面让我们把组件定义在 <i>Togglable</i> 组件中

```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

<!-- You can find the code for our current application in its entirety in the <i>part5-4</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-4). -->
您可以在 [这个仓库](https://github.com/fullstack-hy2020/part2-notes/tree/part5-4)5-4分支中找到我们当前应用的全部代码。


### State of the forms
【表单的状态】

<!-- The state of the application currently is in the _App_ component. -->
应用的状态当前位于 App 组件中。

<!-- React documentation says the [following](https://reactjs.org/docs/lifting-state-up.html) about where to place the state: -->
React[文档](https://reactjs.org/docs/lifting-state-up.html)阐述了关于在哪里放置状态: 

> <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i><br>
通常，几个组件需要反映相同的变化数据。 我们建议将共享状态提升到它们最接近的共同祖先。 

<!-- If we think about the state of the forms, so for example the contents of a new note before it has been created, the _App_ component does not actually need it for anything.  -->
如果我们考虑一下表单的状态，例如一个新便笺的内容在创建之前，App 组件实际上并不需要它做任何事情。
<!-- We could just as well move the state of the forms to the corresponding components.  -->
我们也可以将表单的状态移动到相应的组件中。



<!-- The component for a note changes like so:  -->
便笺的组件变化如下:

```js
import React, {useState} from 'react' 

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
    <div>
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
```



<!-- The <i>newNote</i> state attribute and the event handler responsible for changing it have been moved from the _App_ component to the component responsible for the note form.  -->
<i>newNote</i> state 属性和负责更改它的事件处理程序已经从 App 组件移动到负责记录表单的组件。



<!-- There is only one prop left, the _createNote_ function, which the form calls when a new note is created.  -->
现在只剩下一个props，即 createNote 函数，当创建新便笺时，表单将调用该函数。



<!-- The _App_ component becomes simpler now that we have got rid of the <i>newNote</i> state and its event handler.  -->
既然我们已经摆脱了<i>newNote</i> 状态及其事件处理程序，那么 App 组件就变得更简单了。
<!-- The _addNote_ function for creating new notes receives a new note as a parameter, and the function is the only prop we send to the form:  -->
用于创建新便笺的 addNote 函数接收一个新便笺作为参数，该函数是我们发送到表单的唯一props:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```



<!-- We could do the same for the log in form, but we'll leave that for an optional exercise.  -->
我们可以对 log in 表单执行同样的操作，但是我们将把它留给一个可选练习。



<!-- The application code can be found from [github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-5), -->
<!-- branch <i>part5-5</i>. -->
应用代码可以从[github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-5)中找到,分支<i>5-5</i> 。


### References to components with ref
【引用具有 ref 的组件】

<!-- Our current implementation is quite good, it has one aspect that could be improved. -->

我们当前的实现还不错，但有个地方可以改进

<!-- After a new note is created, it would make sense to hide the new note form. Currently the form stays visible. There is a slight problem with hiding the form. The visibility is controlled with the <i>visible</i> variable inside of the <i>Togglable</i> component. How can we access it outside of the component? -->

当我们创建了一个新的 Note，我们应当隐藏新建 Note 的表单。当前这个表单会持续可见，但隐藏这个表单有个小问题。可见性是透过<i>Togglable</i> 组件的<i>visible</i> 变量来控制的，我们怎么从外部进行访问呢？

<!-- There are many ways to implement closing the form from the parent component, but let's use the [ref](https://reactjs.org/docs/refs-and-the-dom.html) mechanism of React, which offers a reference to the component. -->
实际上从父组件来关闭这个表单有许多方法，我们来使用 React 的 [ref](https://reactjs.org/docs/refs-and-the-dom.html)机制，它提供了一个组件的引用。

<!-- Let's make the following changes to the <i>App</i> component: -->
我们把 <i>App</i> 组件按如下修改：


```js
import React, { useState, useRef } from 'react' // highlight-line

const App = () => {
  // ...
  const noteFormRef = useRef() // highlight-line

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>  // highlight-line
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

<!-- The [useRef](https://reactjs.org/docs/hooks-reference.html#useref) hook is used to create a <i>noteFormRef</i> ref, that is assigned to the <i>Togglable</i> component containing the creation note form. The <i>noteFormRef</i> variable acts as a reference to the component. This hook ensures the same reference (ref) is kept throught renders of the component. -->

[useRef](https://reactjs.org/docs/hooks-reference.html#useref) 方法就是用来创建 <i>noteFormRef</i> 引用，它被加到了能够控制表单创建的 <i>Togglable</i> 组件， <i>noteFormRef</i> 变量就代表了组件的引用。

<!-- We also make the following changes to the <i>Togglable</i> component: -->
我们同样要修改 <i>Togglable</i> 组件：

```js
import React, { useState, useImperativeHandle } from 'react' // highlight-line

const Togglable = React.forwardRef((props, ref) => { // highlight-line
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

// highlight-start
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })
// highlight-end

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})  // highlight-line

export default Togglable
```

<!-- The function that creates the component is wrapped inside of a [forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref) function call. This way the component can access the ref that is assigned to it. -->

创建组件的函数被包裹在了[forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref) 函数调用。利用这种方式可以访问赋给它的引用。

<!-- The component uses the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) hook to make its <i>toggleVisibility</i> function available outside of the component. -->

组件利用[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) Hook来将<i>toggleVisibility</i> 函数能够被外部组件访问到。

<!-- We can now hide the form by calling <i>noteFormRef.current.toggleVisibility()</i> after a new note has been created: -->
我们现在可以在 Note 创建后，通过调用 <i>noteFormRef.current.toggleVisibility()</i> 控制表单的可见性了

```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility() // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {     
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
}
```

<!-- To recap, the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) function is a React hook, that is used for defining functions in a component which can be invoked from outside of the component. -->
总结一下，[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useImperativeHandle)函数是一个 React hook，用于定义组件中的函数，该组件可以从组件外部调用。

<!-- This trick works for changing the state of a component, but it looks a bit unpleasant. We could have accomplished the same functionality with slightly cleaner code using "old React" class-based components. We will take a look at these class components at the part 7 of the course material. So far this is the only situation where using React hooks leads to code that is not cleaner than with class components. -->
这个技巧适用于改变组件的状态，但是看起来有点不舒服。 我们可以使用基于“旧的 React”类组件，用稍微简洁的代码实现相同的功能。 我们将在课程材料的第7章节看看这些类组件。 到目前为止，只有在这种情况下，使用 React hooks 导致的代码不比使用类组件更干净。

<!-- There are also [other use cases](https://reactjs.org/docs/refs-and-the-dom.html) for refs than accessing React components. -->
还有[其他用例](https://reactjs.org/docs/refs-and-the-dom.html)用于 refs 而不是访问 React 组件。

<!-- You can find the code for our current application in its entirety in the <i>part5-6</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-6). -->
您可以在[这个仓库](https://github.com/fullstack-hy2020/part2-notes/tree/part5-6)的<i>part5-6</i> 分支中找到我们当前应用的全部代码。

### One point about components
【关于组件的一个点】



<!-- When we define a component in React: -->
当我们在 React 定义一个组件：

```js
const Togglable = () => ...
  // ...
}
```

<!-- And use it like this: -->
并按如下方式进行使用：

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    first
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    second
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    third
  </Togglable>
</div>
```

<!-- We create <i>three separate instances of the component</i> that all have their own separate state: -->
我们创建了三个单独的组件，并且都有自己的状态：

![](../../images/5/12e.png)

<!-- The <i>ref</i> attribute is used for assigning a reference to each of the components in the variables <i>togglable1</i>, <i>togglable2</i> and <i>togglable3</i>. -->
<i>ref</i> 属性用于为变量 togglable1、 togglable2 和 togglable3 中的每个组件分配一个引用。

</div>

<div class="tasks">



### Exercises 5.5.-5.10.

#### 5.5 Blog list frontend, 步骤5
<!-- Change the form for creating blog posts so that it is only displayed when appropriate. Use functionality similar to what was shown [earlier in this part of the course material](/zh/part5/props_children_与_proptypes#displaying-the-login-form-only-when-appropriate). If you wish to do so, you can use the <i>Togglable</i> component defined in part 5. -->
更改用于创建博客文章的表单，使其只在适当的时候显示。 使用类似于[课程材料前面所展示的功能](/zh/part5/props_children_与_proptypes#displaying-the-login-form-only-when-appropriate)。 如果您希望这样做，可以使用第5章节中定义的<i>Togglable</i> 组件。

<!-- By default the form is not visible -->
默认情况下，窗体不可见

![](../../images/5/13ae.png)

<!-- It expands when button <i>new note</i> is clicked -->
当单击<i>new note</i> 按钮时，它会展开

![](../../images/5/13be.png)


<!-- The form closes when a new blog is created. -->
当创建新博客时，表单将关闭。

#### 5.6 Blog list frontend, 步骤6

<!-- Separate the form for creating a new blog into its own component (if you have not already done so), and  -->
<!-- move all the states required for creating a new blog to this component.  -->
将创建新 blog 的表单分离到它自己的组件中(如果您还没有这样做) ，并将创建新博客所需的所有状态移动到此组件。

<!-- The component must work like the <i>NoteForm</i> component from the [material](/osa5/props_children_ja_proptypet#lomakkeiden-tila) of this part. -->
这个组件必须像[这里](/zh/part5/props_children_与_proptypes)的<i>NoteForm</i> 组件那样工作。

#### 5.7* Blog list frontend, 步骤7

<!-- Let's add a button to each blog, which controls whether all of the details about the blog are shown or not. -->
让我们为每个博客添加一个按钮，用于控制是否显示博客的所有细节。

<!-- Full details of the blog open when the button is clicked. -->
点击按钮时打开博客的详细信息。

![](../../images/5/13ea.png)



<!-- And the details are hidden when the button is clicked again.  -->
当再次单击按钮时，细节将被隐藏。

<!-- At this point the <i>like</i> button does not need to do anything. -->
此时， <i>like</i> 按钮不需要做任何事情。

<!-- The application shown in the picture has a bit of additional CSS to improve its appearance. -->
图中显示的应用使用了一些附加的 CSS 来改善其外观。

<!-- It is easy to add styles to the application as shown in part 2 using [inline](/zh/part2/给_react应用加点样式#inline-styles) styles: -->
使用[inline](/zh/part2/给_react应用加点样式#inline-styles)样式向应用添加样式很容易，如第2章节所示:

```js
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}> // highlight-line
      <div>
        {blog.title} {blog.author}
      </div>
      // ...
  </div>
)}
```

<!-- **NB1:** you can make the name of a blog post click-able as shown in the part of the code that is highlighted. -->
<!-- **注意1：** 您可以使博客文章的名称可以点击，如代码中突出显示的部分所示。 -->

<!-- **NB2:** even though the functionality implemented in this part is almost identical to the functionality provided by the <i>Togglable</i> component, the component can not be used directly to achieve the desired behavior. The easiest solution will be to add state to the blog post that controls the displayed form of the blog post. -->
**注意：** 尽管该部分实现的功能与<i>Togglable</i> 组件提供的功能几乎完全相同，但该组件不能直接用于实现所需的行为。 最简单的解决方案是将状态添加到控制博客文章显示形式的博客文章中。

#### 5.8*: Blog list frontend, 步骤8

<!-- Implement the functionality for the like button. Likes are increased by making an HTTP _PUT_ request to the unique address of the blog post in the backend. -->
实现 like 按钮的功能。 通过向后端中的博客文章的唯一地址发出 HTTP PUT 请求，可以增加like。

<!-- Since the backend operation replaces the entire blog post, you will have to send all of its fields  in the request body. If you wanted to add a like to the following blog post: -->
由于后端操作将替换整个 blog 文章，因此必须在请求主体中发送其所有字段。 如果你想在下面的博客文章中添加赞:

```js
{
  _id: "5a43fde2cbd20b12a2c34e91",
  user: {
    _id: "5a43e6b6c37f3d065eaaa581",
    username: "mluukkai",
    name: "Matti Luukkainen"
  },
  likes: 0,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
},
```

<!-- You would have to make an HTTP PUT request to the address <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> with the following request data: -->
您必须使用如下请求数据向地址 <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i>发出 HTTP PUT 请求:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

<!-- **One last warning:** if you notice that you are using async/await and the _then_-method in the same code, it is almost certain that you are doing something wrong. Stick to using one or the other, and never use both at the same time "just in case".  -->
**最后一个警告:** 如果您注意到在同一段代码中混用了 async/await 和 then 方法，那么几乎可以肯定您做错了什么。 坚持使用一种或另一种，永远不要同时使用两种，“以防万一”。

#### 5.9*: Blog list frontend, 步骤9
<!-- Modify the application to list the blog posts by the number of <i>likes</i>. Sorting the blog posts can be done with the array [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method. -->
根据<i>like</i> 的数量修改应用以列出博客文章。 对博客文章进行排序可以使用数组[sort](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/sort)方法。

#### 5.10*: Blog list frontend, 步骤10
<!-- Add a new button for deleting blog posts. Also implement the logic for deleting blog posts in the backend. -->
添加一个新的按钮用于删除博客文章。还可以在后端实现删除博客文章的逻辑。

<!-- Your application could look something like this: -->
您的应用可以是这样的:

![](../../images/5/14ea.png)

<!-- The confirmation dialog for deleting a blog post is easy to implement with the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) function. -->
用于删除博客文章的确认对话框很容易通过[window.confirm](https://developer.mozilla.org/en-us/docs/web/api/window/confirm)函数实现。

<!-- Show the button for deleting a blog post only if the blog post was added by the user. -->
只有当用户添加了博客文章时，才显示删除博客文章的按钮。

</div>


<div class="content">

### PropTypes

<!-- The <i>Togglable</i> component assumes that it is given the text for the button via the <i>buttonLabel</i> prop. If we forget to define it to the component: -->
<i>Togglable</i> 组件假定使用者会通过 <i>buttonLabel</i> 属性获传递按钮的文本。 如果我们忘记给组件定义:

```js
<Togglable> buttonLabel forgotten... </Togglable>
```

<!-- The application works, but the browser renders a button that that has no label text. -->

应用会运行正常，但浏览器呈现一个没有 label text 的按钮。

<!-- We would like to enforce that when the <i>Togglable</i> component is used, the button label text prop must be given a value. -->
如果我们希望使用 <i>Togglable</i> 组件时，强制给按钮一个 label text 属性值。

<!-- The expected and required props of a component can be defined with the [prop-types](https://github.com/facebook/prop-types) package. Let's install the package: -->
这个需求可以通过 [prop-types](https://github.com/facebook/prop-types) 包来定义，我们来安装一下：

```bash
npm install prop-types
```

<!-- We can define the <i>buttonLabel</i> prop as a mandatory or <i>required</i> string-type prop as shown below: -->
我们可以定义 <i>buttonLabel</i> 属性定义为 mandatory，或按如下加入<i>required</i> 这种字符串类型的属性：

```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

<!-- The console will display the following error message if the prop is left undefined: -->
如果这时属性是 undefined，控制台就会展示如下的错误信息

![](../../images/5/15.png)

<!-- The application still works and nothing forces us to define props despite the PropTypes definitions. Mind you, it is extremely unprofessional to leave <i>any</i> red output to the browser console. -->
虽然应用程序仍然可以工作，没有任何东西强迫我们定义 PropTypes。 但它可以通过控制台飙红来提醒我们，因为不处理红色警告是非常不专业的做法。

<!-- Let's also define PropTypes to the <i>LoginForm</i> component: -->
让我们给 <i>LoginForm</i> 组件同样定义一个 PropTypes。

```js
import PropTypes from 'prop-types'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
    // ...
  }

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
```

<!-- If the type of a passed prop is wrong, e.g. if we try to define the <i>handleSubmit</i> prop as a string, then this will result in the following warning: -->
如果传递给 prop 的类型是错误的。例如，如果我们尝试定义 <i>handleSubmit</i> 成 string，那结果会出现如下警告：

![](../../images/5/16.png)

### ESlint

<!-- In part 3 we configured the [ESlint](/zh/part3/es_lint与代码检查#lint) code style tool to the backend. Let's take ESlint to use in the frontend as well. -->
在第三章节中我们配置了[ESlint](/zh/part3/es_lint与代码检查#lint) ，为后台代码控制了代码样式。让我们同样加到前台代码中。

<!-- Create-react-app has installed ESlint to the project by default, so all that's left for us to do is to define our desired configuration in the <i>.eslintrc.js</i> file. -->
Create-react-app 已经默认为项目安装好了 ESlint， 所以我们需要做的就是定义自己的<i>.eslintrc.js</i> 文件 

<!--*NB:* do not run the _eslint --init_ command. It will install the latest version of ESlint that is not compatible with the configuration file created by create-react-app!-->
注意: 不要运行 eslint-- init 命令。 它将安装与 create-react-app 创建的配置文件不兼容的最新版本的 ESlint！

<!-- Next, we will start testing the frontend and in order to avoid undesired and irrelevant linter errors we will install the [eslint-jest-plugin](https://www.npmjs.com/package/eslint-plugin-jest) package: -->
下面，我们将开始测试前端，为避免不想要和不相关的 lint 错误，我们先安装[eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) 库：

```bash
npm install --save-dev eslint-plugin-jest
```

<!-- Let's create a <i>.eslintrc.js</i> file with the following contents: -->
让我们为 <i>.eslintrc.js</i> 添加如下内容

```js
module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest/globals": true 
  },
  "extends": [ 
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "react", "jest"
  ],
  "rules": {
      "indent": [
          "error",
          2  
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "never"
      ],
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
          "error", "always"
      ],
      "arrow-spacing": [
          "error", { "before": true, "after": true }
      ],
      "no-console": 0,
      "react/prop-types": 0
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

<!-- NOTE: If you are using Visual Studio Code together with ESLint plugin, you might need to add additional workspace setting for it to work. If you are seeing ```Failed to load plugin react: Cannot find module 'eslint-plugin-react' ``` additional configuration is needed. Adding line ```"eslint.workingDirectories": [{ "mode": "auto" }] ``` to settings.json in the workspace seems to work. See [here](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807) for more information.  -->
注意： 如果你将 Visual Studio Code 与 ESLint 插件一起使用，你可能需要增加额外的workspace级别的设置才能使其正常工作。如果看到```Failed to load plugin react: Cannot find module 'eslint-plugin-react' ``` 说明需要一些额外的配置，增加```"eslint.workingDirectories": [{ "mode": "auto" }] ``` 到 workspace 的settings.json文件中就运行正常了，具体详见[这里](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807)

<!-- Let's create [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file with the following contents to the repository root -->
让我们创建一个 [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) 添加如下内容：

```bash
node_modules
build
```

<!-- Now the directories <em>build</em> and <em>node_modules</em> will be skipped when linting. -->
现在 <em>build</em> 和 <em>node_modules</em> 这两个文件夹就不会被 lint 到了

<!-- Let us also create a npm script to run the lint: -->
同样让我们为 lint 创建一个 npm 脚本：

```js
{
  // ...
  {
    "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 db.json",
    "eslint": "eslint ." // highlight-line
  },
  // ...
}
```

<!-- Compomnent _Togglable_ causesa a nasty looking warning <i>Component definition is missing display name</i>:  -->
组件 _Togglable_  导致了一些烦人的警告：组件定义缺少显示名:

![](../../images/5/25ea.png)


<!-- The react-devtools also reveals that the component does not have name: -->
React-devtools 还显示组件没有名称: 

![](../../images/5/26ea.png)


<!-- Fortunately this is easy to fix -->
幸运的是，这个问题很容易解决

```js
import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ...
})

Togglable.displayName = 'Togglable' // highlight-line

export default Togglable
```

<!-- You can find the code for our current application in its entirety in the <i>part5-7</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-7). -->
您可以在[this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-7)的<i>part5-7</i> 分支中找到我们当前应用的全部代码。

</div>

<div class="tasks">


### Exercises 5.11.-5.12.
#### 5.11: Blog list frontend, 步骤11
<!-- Define PropTypes for one of the components of your application. -->
为应用的一个组件定义 PropTypes。

#### 5.12: Blog list frontend, 步骤12
<!-- Add ESlint to the project. Define the configuration according to your liking. Fix all of the linter errors. -->
向项目中添加 ESlint。根据您的喜好定义配置。修复所有的lint错误。

<!-- Create-react-app has installed ESlint to the project by default, so all that's left for you to do is to define your desired configuration in the <i>.eslintrc.js</i> file.  -->
Create-react-app 默认已经在项目中安装了 ESlint，所以剩下要做的就是在<i>中定义你想要的 <i>.eslintrc.js</i> 文件。 

<!--*NB:* do not run the _eslint --init_ command. It will install the latest version of ESlint that is not compatible with the configuration file created by create-react-app!-->
注意: 不要运行 eslint-- init 命令。 它将安装与 create-react-app 创建的配置文件不兼容的最新版本的 ESlint！

</div>

