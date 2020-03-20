---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: zh
---

<div class="content">



### Displaying the login form only when appropriate
# # # 只在适当的时候显示登入表单


Let's modify the application so that the login form is not displayed by default:
让我们修改应用，使登录表单在默认情况下不显示:

![](../../images/5/10e.png)



The login form appears when the user presses the <i>login</i> button:
当用户按下<i>login</i> 按钮时，登录表单就会出现:

![](../../images/5/11e.png)



The user can close the login form by clicking the <i>cancel</i> button.
用户可以通过单击<i>cancel</i> 按钮来关闭登录表单。


Let's start by extracting the login form into its own component:
让我们从将登录表单提取到它自己的组件开始:

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


The state and all the functions related to it are defined outside of the component and are passed to the component as props.
状态和与之相关的所有函数都在组件之外定义，并作为props传递给组件。


Notice that the props are assigned to variables through <i>destructuring</i>, which means that instead of writing:
注意，props是通过<i>destructuring</i> 分配给变量的，这意味着不写:

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


where the properties of the _props_ object are accessed through e.g. _props.handleSubmit_, the properties are assigned directly to their own variables.
当 props.handleSubmit 访问 props 对象的属性时，属性被直接赋值给它们自己的变量。


One fast way of implementing the functionality is to change the _loginForm_ function of the <i>App</i> component like so:
实现这个功能的一个快速方法是更改<i>App</i> 组件的 loginForm 函数，如下所示:

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


The <i>App</i> components state now contains the boolean <i>loginVisible</i>, that defines if the login form should be shown to the user or not.
I App /<i>组件状态现在包含布尔值 i loginVisible</i>，它定义登录表单是否应该显示给用户。


The value of loginVisible is toggled with two buttons. Both buttons have their event handlers defined directly in the component:
使用两个按钮来切换 loginVisible 的值。两个按钮都直接在组件中定义了事件处理程序:

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```


The visibility of the component is defined by giving the component an [inline](/en/part2/adding_styles_to_react_app#inline-styles) style rule, where the value of the [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property is <i>none</i> if we do not want the component to be displayed:
组件的可见性是通过给组件一个[ inline ](/ en / part2 / add styles to react app # inline-styles)样式规则来定义的，如果我们不想显示组件，那么[ display ]( https://developer.mozilla.org/en-us/docs/web/css/display )属性的值为<i>none</i>:

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


We are once again using the "question mark" ternary operator. If _loginVisible_ is <i>true</i>, then the CSS rule of the component will be:
我们再次使用“问号”三元操作符。 如果 loginVisible 是<i>true</i>，那么组件的 CSS 规则是:

```css
display: 'none';
```


If _loginVisible_ is <i>false</i>, then <i>display</i>  will not receive any value related to the visibility of the component.
如果 loginVisible 是<i>false</i>，那么我显示 / i 将不会收到任何与组件可见性相关的值。


### The components children, aka. props.children
组成部分孩子们，又名 props.children


The code related to managing the visibility of the login form could be considered to be its own logical entity, and for this reason it would be good to extract it from the <i>App</i> component into its own separate component.
与管理登录表单的可见性相关的代码可以被认为是它自己的逻辑实体，因此最好将它从<i>App</i> 组件提取到它自己的单独组件中。


Our goal is to implement a new <i>Togglable</i> component that can be used in the following way:
我们的目标是实现一个新的<i>Togglable</i> 组件，它可以用如下方式使用:

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


The way that the component is used is slightly different from our previous components. The component has both an opening and a closing tags which surround a <i>LoginForm</i> component. In React terminology <i>LoginForm</i> is a child component of <i>Togglable</i>.
组件的使用方式与前面的组件稍有不同。 这个组件有一个开始标记和一个结束标记，它们围绕着一个<i>LoginForm</i> 组件。 在 React 术语中，i LoginForm /<i>是 i Togglable</i> 的子组件。


We can add any React elements we want between the opening and closing tags of <i>Togglable</i>, like this for example:
我们可以在<i>Togglable</i> 的开始和结束标签之间添加任何 React 元素，例如:

```js
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```


The code for the <i>Togglable</i> component is shown below:
I Togglable / i 组件的代码如下:

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


The new and interesting part of the code is [props.children](https://reactjs.org/docs/glossary.html#propschildren), that is used for referencing the child components of the component. The child components are the React elements that we define between the opening and closing tags of a component.
代码中新的和有趣的部分是[ props.children ]( https://reactjs.org/docs/glossary.html#propschildren ) ，它用于引用组件的子组件。 子组件是我们在组件的开始和结束标记之间定义的 React 元素。


This time the children are rendered in the code that is used for rendering the component itself:
这一次，子元素被渲染在用于渲染组件本身的代码中:

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```


Unlike the "normal" props we've seen before, <i>children</i> is automatically added by React and always exists. If a component is defined with an automatically closing _/>_ tag, like this:
与我们之前见过的“正常”props不同，i children / i 是由 React 自动添加的，并且始终存在。 如果一个组件定义了一个自动关闭 / 标记，像这样:

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```


Then <i>props.children</i> is an empty array.
然后，i props.children / i 是一个空数组。


The <i>Togglable</i> component is reusable and we can use it to add similar visibility toggling functionality to the form that is used for creating new notes.
I Togglable / i 组件是可重用的，我们可以使用它向用于创建新注释的表单添加类似的可见性切换功能。


Before we do that, let's extract the form for creating notes into its own component:
在此之前，让我们将创建笔记的表单提取到它自己的组件中:

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
```
Next let's define the form component inside of a <i>Togglable</i> component:
接下来让我们定义<i>Togglable</i> 组件中的表单组件:

```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```


You can find the code for our current application in its entirety in the <i>part5-4</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-4).
您可以在[ this github repository ]的<i>/ part5-4</i> 分支中找到我们当前应用的全部代码，该分支位于 https://github.com/fullstack-hy2020/part2-notes/tree/part5-4。


### State of the forms
表格的状态

<!-- Koko sovelluksen tila on nyt sijoitettu komponenttiin _App_.  -->

The state of the application currently is in the _App_ component.
应用的状态当前位于 App 组件中。

<!-- Reactin dokumentaatio antaa seuraavan [ohjeen](https://reactjs.org/docs/lifting-state-up.html) tilan sijoittamisesta: -->

React documentation says the [following](https://reactjs.org/docs/lifting-state-up.html) about where to place the state:
React文档说[如下]( https://reactjs.org/docs/lifting-state-up.html )关于在哪里放置国家:

> <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>
通常，几个组件需要反映相同的变化数据。 我们建议将共享状态提升到它们最接近的共同祖先。 我

<!-- Jos mietitään lomakkeiden tilaa, eli esimerkiksi uuden muistiinpanon sisältöä sillä hetkellä kun muistiinpanoa ei vielä ole luotu, ei komponentti _App_ oikeastaan tarvitse niitä mihinkään, ja voisimme aivan hyvin siirtää tilan lomakkeisiin liittyvän tilan niitä vastaaviin komponentteihin. -->

If we think about the state of the forms, so for example the contents of a new note before it has been created, the _App_ component does not actually need it for anything. 
如果我们考虑一下表单的状态，例如一个新笔记的内容在创建之前，App 组件实际上并不需要它做任何事情。
We could just as well move the state of the forms to the corresponding components. 
我们也可以将表单的状态移动到相应的组件中。

<!-- Muistiinpanosta huolehtiva komponentti muuttuu seuraavasti: -->

The component for a note changes like so: 
音符的组件变化如下:

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

<!-- Tilan muuttuja <i>newNote</i> ja sen muutokseta huolehtiva tapahtumankäsittelijä on siirretty komponentista _App_ lomakkeesta huolehtivaan komponenttiin. -->

The <i>newNote</i> state attribute and the event handler responsible for changing it have been moved from the _App_ component to the component responsible for the note form. 
I newNote / i state 属性和负责更改它的事件处理程序已经从 App 组件移动到负责记录表单的组件。

<!-- Propseja on enää yksi, funktio _createNote_, jota lomake kutsuu kun uusi muistiinpano luodaan. -->

There is only one prop left, the _createNote_ function, which the form calls when a new note is created. 
现在只剩下一个props，即 createNote 函数，当创建新便条时，表单将调用该函数。

<!-- Komponentti _App_ yksintertaistuu, tilasta <i>newNote</i> ja sen käsittelijäfunktiosta on päästy eroon. Uuden muistiinpanon luomisesta huolehtiva funktio _addNote_ saa suoraan parametriksi uuden muistiinpanon ja funktio on ainoa props, joka välitetään lomakkeelle: -->

The _App_ component becomes simpler now that we have got rid of the <i>newNote</i> state and its event handler. 
既然我们已经摆脱了<i>newNote</i> 状态及其事件处理程序，那么 App 组件就变得更简单了。
The _addNote_ function for creating new notes receives a new note as a parameter, and the function is the only prop we send to the form: 
用于创建新笔记的 addNote 函数接收一个新笔记作为参数，该函数是我们发送到表单的唯一props:

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

<!-- Vastaava muutos voitaisiin tehdä myös kirjautumislomakkeelle, mutta jätämme sen vapaaehtoiseksi harjoitustehtäväksi. -->

We could do the same for the log in form, but we'll leave that for an optional exercise. 
我们可以对 log in 表单执行同样的操作，但是我们将把它留给一个可选练习。

<!-- Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-5), branchissa <i>part5-5</i>. -->

The application code can be found from [github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-5),
应用代码可以从[ github ]( https://github.com/fullstack-hy2020/part2-notes/tree/part5-5)中找到,
branch <i>part5-5</i>.
分支<i>第5-5</i> 部分。

### References to components with ref
# # # 引用带 ref 的组件

Our current implementation is quite good, it has one aspect that could be improved.
我们目前的实现是相当好的，它有一个方面可以改进。

After a new note is created, it would make sense to hide the new note form. Currently the form stays visible. There is a slight problem with hiding the form. The visibility is controlled with the <i>visible</i> variable inside of the <i>Togglable</i> component. How can we access it outside of the component?
在创建新笔记之后，隐藏新笔记表单是有意义的。 当前窗体仍然可见。 隐藏表单有一个小问题。 可见性是通过<i>Togglable</i> 组件内部的<i>visible</i> 变量控制的。 我们如何在组件之外访问它？

There are many ways to implement closing the form from the parent component, but let's use the [ref](https://reactjs.org/docs/refs-and-the-dom.html) mechanism of React, which offers a reference to the component.
有许多方法可以实现从父组件中关闭表单，但是让我们使用 React 的[ ref ]( https://reactjs.org/docs/refs-and-the-dom.html )机制，它提供了对组件的引用。

Let's make the following changes to the <i>App</i> component:
让我们对<i>App</i> 组件进行如下更改:

```js
const App = () => {
  // ...
  const noteFormRef = React.createRef() // highlight-line

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>  // highlight-line
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```


The [createRef](https://reactjs.org/docs/react-api.html#reactcreateref) method is used to create a <i>noteFormRef</i> ref, that is assigned to the <i>Togglable</i> component containing the creation note form. The <i>noteFormRef</i> variable acts as a reference to the component.
方法用于创建一个<i>noteFormRef</i> ref，该 https://reactjs.org/docs/react-api.html#reactcreateref 被分配给包含创建通知表单的<i>Togglable</i> 组件。<i>noteFormRef</i> 变量充当对组件的引用。


We also make the following changes to the <i>Togglable</i> component:
我们还对<i>Togglable</i> 组件进行了如下更改:

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


The function that creates the component is wrapped inside of a [forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref) function call. This way the component can access the ref that is assigned to it.
创建组件的函数包装在一个[ forwardRef ]( https://reactjs.org/docs/react-api.html#reactforwardref )函数调用中。 这样，组件就可以访问分配给它的 ref。

The component uses the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) hook to make its <i>toggleVisibility</i> function available outside of the component.
这个组件使用了[ useImperativeHandle ]( https://reactjs.org/docs/hooks-reference.html#useImperativeHandle )挂钩来使它的<i>toggleVisibility</i> 函数在组件之外可用。

We can now hide the form by calling <i>noteFormRef.current.toggleVisibility()</i> after a new note has been created:
现在，我们可以在创建新注释之后，通过调用<i>noteFormRef.current.toggleVisibility ()</i> 来隐藏表单:

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

To recap, the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) function is a React hook, that is used for defining functions in a component which can be invoked from outside of the component.
总结一下，[ useImperativeHandle ]( https://reactjs.org/docs/hooks-reference.html#useImperativeHandle )函数是一个 React hook，用于定义组件中的函数，该组件可以从组件外部调用。

This trick works for changing the state of a component, but it looks a bit unpleasant. We could have accomplished the same functionality with slightly cleaner code using "old React" class-based components. We will take a look at these class components at the part 7 of the course material. So far this is the only situation where using React hooks leads to code that is not cleaner than with class components.
这个技巧适用于改变组件的状态，但是看起来有点不舒服。 我们可以使用基于“旧的 React”类的组件，用稍微简洁的代码实现相同的功能。 我们将在课程材料的第7章节看看这些类组成部分。 到目前为止，只有在这种情况下，使用 React hooks 导致的代码并不比使用类组件更干净。

There are also [other use cases](https://reactjs.org/docs/refs-and-the-dom.html) for refs than accessing React components.
还有[其他用例]( https://reactjs.org/docs/refs-and-the-dom.html )用于 refs 而不是访问 React 组件。

You can find the code for our current application in its entirety in the <i>part5-6</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-6).
您可以在[ this github repository ]的<i>part5-6</i> 分支中找到我们当前应用的全部代码，该分支是 https://github.com/fullstack-hy2020/part2-notes/tree/part5-6文件库。

### One point about components
关于组件的一点


When we define a component in React:
当我们在 React 中定义一个组件时:

```js
const Togglable = () => ...
  // ...
}
```


And use it like this:
像这样使用它:

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


We create <i>three separate instances of the component</i> that all have their own separate state:
我们创建了三个独立的 component / i 实例，它们都有自己的独立状态:

![](../../images/5/12e.png)



The <i>ref</i> attribute is used for assigning a reference to each of the components in the variables <i>togglable1</i>, <i>togglable2</i> and <i>togglable3</i>.
I ref /<i>属性用于为变量 i togglable1</i>、<i>togglable2</i> 和<i>togglable3</i> 中的每个组件分配一个引用。

</div>


<div class="tasks">



### Exercises 5.5.-5.10.
练习5.5-5.10。


#### 5.5 Blog list frontend, step5
5.5 Blog list frontend，step5

Change the form for creating blog posts so that it is only displayed when appropriate. Use functionality similar to what was shown [earlier in this part of the course material](/en/part5/props_children_and_proptypes#displaying-the-login-form-only-when-appropriate). If you wish to do so, you can use the <i>Togglable</i> component defined in part 5.
更改用于创建博客文章的表单，使其只在适当的时候显示。 使用类似于课程材料前面所展示的功能(/ en / part5 / props children and proptypes # display-the-login-form-only-when-appropriate)。 如果您希望这样做，可以使用第5章节中定义的<i>Togglable</i> 组件。

By default the form is not visible
默认情况下，窗体不可见

![](../../images/5/13ae.png)


It expands when button <i>new note</i> is clicked
当单击<i>new note</i> 按钮时，它会扩展

![](../../images/5/13be.png)


The form closes when a new blog is created.
当创建新博客时，表单将关闭。

#### 5.6 Blog list frontend, step6
5.6 Blog list frontend，step6

<!-- Eriytä uuden blogin luomisesta huolehtiva lomake omaan komponenttiinsa (jos et jo ole niin tehnyt), ja siirrä kaikki uuden blogin luomiseen liittyvä tila komponentin vastuulle.  -->

Separate the form for creating a new blog into its own component (if you have not already done so), and 
将创建新 blog 的表单分离到它自己的组件中(如果您还没有这样做) ，并
move all the states required for creating a new blog to this component. 
将创建新博客所需的所有州移动到此组件。

<!-- Komponentin tulee siis toimia samaan tapaan kuin tämän osan [materiaalin](http://localhost:8000/osa5/props_children_ja_proptypet#lomakkeiden-tila) komponentin <i>NewNote</i>. -->

The component must work like the <i>NewNote</i> component from the [material](/osa5/props_children_ja_proptypet#lomakkeiden-tila) of this part.
这个组件必须像这个部件的[ material ](/ osa5 / proptypet children ja # lomakkeiden-tila)中的<i>/ NewNote</i> 组件那样工作。

#### 5.7* Blog list frontend, step7
5.7 * Blog list frontend，step7

<!-- Lisää yksittäiselle blogille nappi, jonka avulla voi kontrolloida näytetäänkö kaikki blogiin liittyvät tiedot. -->
——伊塞尔 · 布洛基 · 纳皮，琼卡 · 阿乌拉 · 沃伊 · 罗德里格斯(jonka avulla voi kontrolloida n ytet nk kaikki blogiin liittyv t t tidot ——译注)
Let's add each blog a button, which controls if all of the details about the blog are shown or not.
让我们为每个博客添加一个按钮，用于控制是否显示博客的所有细节。

<!-- Klikkaamalla nappia sen täydelliset tiedot aukeavat. -->

Full details of the blog open when the button is clicked.
点击按钮时打开博客的详细信息。

![](../../images/5/13ea.png)


<!-- Uusi napin klikkaus pienentää näkymän. -->

And the details are hidden when the button is clicked again. 
当再次单击按钮时，细节将被隐藏。

At this point the <i>like</i> button does not need to do anything.
此时，i like / i 按钮不需要做任何事情。

The application shown in the picture has a bit of additional CSS to improve its appearance.
图中显示的应用使用了一些附加的 CSS 来改善其外观。

It is easy to add styles to the application as shown in part 2 using [inline](/en/part2/adding_styles_to_react_app#inline-styles) styles:
使用[ inline ](/ en / part2 / add styles to react app # inline-styles)样式向应用添加样式很容易，如第2章节所示:

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

**NB1:** you can make the name of a blog post click-able as shown in the part of the code that is highlighted.
* * NB1: 您可以使博客文章的名称可以点击，如代码中突出显示的部分所示。


**NB2:** even though the functionality implemented in this part is almost identical to the functionality provided by the <i>Togglable</i> component, the component can not be used directly to achieve the desired behavior. The easiest solution will be to add state to the blog post that controls the displayed form of the blog post.
* * NB2: 尽管该部分实现的功能与<i>Togglable</i> 组件提供的功能几乎完全相同，但该组件不能直接用于实现所需的行为。 最简单的解决方案是将状态添加到控制博客文章显示形式的博客文章中。

#### 5.8*: Blog list frontend, step7
5.8 * : Blog list frontend，step7

Implement the functionality for the like button. Likes are increased by making an HTTP _PUT_ request to the unique address of the blog post in the backend.
实现 like 按钮的功能。 通过向后端中的博客文章的唯一地址发出 HTTP PUT 请求，可以增加喜欢。

Since the backend operation replaces the entire blog post, you will have to send all of its fields  in the request body. If you wanted to add a like to the following blog post:
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

You would have to make an HTTP PUT request to the address <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> with the following request data:
您必须使用如下请求数据向地址<i>/ api / blogs / 5a43fde2cbd20b12a2c34e91</i> 发出 HTTP PUT 请求:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

**One last warning:** if you notice that you are using async/await and the _then_-method in the same code, it is almost certain that you are doing something wrong. Stick to using one or the other, and never use both at the same time "just in case". 
最后一个警告: 如果您注意到在同一段代码中使用了 async / await 和 then-method，那么几乎可以肯定您做错了什么。 坚持使用一种或另一种，永远不要同时使用两种，“以防万一”。

#### 5.9*: Blog list frontend, step8
5.9 * : Blog list frontend，step8

Modify the application to list the blog posts by the number of <i>likes</i>. Sorting the blog posts can be done with the array [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method.
根据<i>like</i> 的数量修改应用以列出博客文章。 对博客文章进行排序可以使用数组[ sort ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/sort )方法。

#### 5.10*: Blog list frontend, step9
5.10 * : Blog list frontend，step9

Add a new button for deleting blog posts. Also implement the logic for deleting blog posts in the backend.
添加一个新的按钮用于删除博客文章。还可以在后端实现删除博客文章的逻辑。

Your application could look something like this:
您的应用可以是这样的:

![](../../images/5/14ea.png)


The confirmation dialog for deleting a blog post is easy to implement with the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) function.
用于删除博客文章的确认对话框很容易通过[ window.confirm ]( https://developer.mozilla.org/en-us/docs/web/api/window/confirm )函数实现。

Show the button for deleting a blog post only if the blog post was added by the user.
只有当用户添加了博客文章时，才显示删除博客文章的按钮。

</div>


<div class="content">


### PropTypes
# # PropTypes

The <i>Togglable</i> component assumes that it is given the text for the button via the <i>buttonLabel</i> prop. If we forget to define it to the component:
I Togglable /<i>组件假设它通过 i buttonLabel</i> prop 获得按钮的文本。 如果我们忘记给组件定义它:

```js
<Togglable> buttonLabel forgotten... </Togglable>
```

The application works, but the browser renders a button that that has no label text.
应用可以运行，但浏览器渲染的按钮没有标签文本。

We would like to enforce that when the <i>Togglable</i> component is used, the button label text prop must be given a value.
我们希望强制在使用<i>Togglable</i> 组件时，必须为按钮标签文本支撑赋值。

The expected and required props of a component can be defined with the [prop-types](https://github.com/facebook/prop-types) package. Let's install the package:
一个组件需要的props可以通过[ prop-types ](prop-types)包来定义，让我们来安装这个包:

```js
npm install --save prop-types
```

We can define the <i>buttonLabel</i> prop as a mandatory or <i>required</i> string-type prop as shown below:
我们可以将<i>buttonLabel</i> prop 定义为一个强制的或者<i>required</i> string-type prop，如下所示:

```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

The console will display the following error message if the prop is left undefined:
控制台将显示如下错误信息，如果props没有定义:

![](../../images/5/15.png)



The application still works and nothing forces us to define props despite the PropTypes definitions. Mind you, it is extremely unprofessional to leave <i>any</i> red output to the browser console.
应用仍然可以工作，尽管 PropTypes 定义了 PropTypes，但没有任何东西强迫我们定义 PropTypes。 请注意，将 i / i 红色输出留给浏览器控制台是非常不专业的。

Let's also define PropTypes to the <i>LoginForm</i> component:
让我们也为<i>LoginForm</i> 组件定义 PropTypes:

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

If the type of a passed prop is wrong, e.g. if we try to define the <i>handleSubmit</i> prop as a string, then this will result in the following warning:
如果传递的props的类型是错误的，例如，如果我们试图将<i>handleSubmit</i> props定义为一个字符串，那么这将导致如下警告:

![](../../images/5/16.png)


### ESlint
埃斯林特

In part 3 we configured the [ESlint](/en/part3/validation_and_es_lint#lint) code style tool to the backend. Let's take ESlint to use in the frontend as well.
在第3章节中，我们将[ ESlint ](/ en / part3 / validation 和 es lint # lint)代码样式工具配置到后端。 让我们在前端也使用 ESlint。

Create-react-app has installed ESlint to the project by default, so all that's left for us to do is to define our desired configuration in the <i>.eslintrc.js</i> file. 
Create-react-app 默认已经在项目中安装了 ESlint，所以我们要做的就是在<i>中定义我们想要的配置。</i> 文件。

*NB:* do not run the _eslint --init_ command. It will install the latest version of ESlint that is not compatible with the configuration file created by create-react-app!
注意: 不要运行 eslint-- init 命令。 它将安装与 create-react-app 创建的配置文件不兼容的最新版本的 ESlint！

Next, we will start testing the frontend and in order to avoid undesired and irrelevant linter errors we will install the [eslint-jest-plugin](https://www.npmjs.com/package/eslint-plugin-jest) package:
接下来，我们将开始测试前端，为了避免不希望出现的和不相关的连接错误，我们将安装[ eslint-jest-plugin ]( https://www.npmjs.com/package/eslint-plugin-jest )包:

```js
npm add --save-dev eslint-plugin-jest
```

Let's create a <i>.eslintrc.js</i> file with the following contents:
让我们创建一个包含如下内容的 i. eslintrc.js / i 文件:

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
  }
}
```

Let's create [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file with the following contents to the repository root
让我们创建一个包含如下内容的[ . eslintignore ]( https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories 文件)文件到存储库根目录

```bash
node_modules
build
```

Now the directories <em>build</em> and <em>node_modules</em> will be skipped when linting.
现在，当进行 linting 时，将跳过目录 em build / em 和 em 节点模块 / em。

Let us also create a npm script to run the lint:
让我们也创建一个 npm 脚本来运行 lint:

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

Compomnent _Togglable_ causesa a nasty looking warning <i>Component definition is missing display name</i>: 
组件定义缺少显示名 / i:

![](../../images/5/25ea.png)


The react-devtools also reveals that the component does not have name:
React-devtools 还显示组件没有名称:

![](../../images/5/25ea.png)


Fortunately this is easy to fix
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

You can find the code for our current application in its entirety in the <i>part5-7</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-7).
您可以在[ this github repository ]的<i>part5-7</i> 分支中找到我们当前应用的全部代码 https://github.com/fullstack-hy2020/part2-notes/tree/part5-7。

</div>


<div class="tasks">


### Exercises 5.11.-5.12.
练习5.11-5.12。

#### 5.11: Blog list frontend, step11
5.11: Blog list frontend，step11

Define PropTypes for one of the components of your application.
为应用的一个组件定义 PropTypes。

#### 5.12: Blog list frontend, step12
5.12: Blog list frontend，step12

Add ESlint to the project. Define the configuration according to your liking. Fix all of the linter errors.
向项目中添加 ESlint。根据您的喜好定义配置。修复所有的连接错误。

Create-react-app has installed ESlint to the project by default, so all that's left for you to do is to define your desired configuration in the <i>.eslintrc.js</i> file. 
Create-react-app 默认已经在项目中安装了 ESlint，所以剩下要做的就是在<i>中定义你想要的配置。</i> 文件。

*NB:* do not run the _eslint --init_ command. It will install the latest version of ESlint that is not compatible with the configuration file created by create-react-app!
注意: 不要运行 eslint-- init 命令。 它将安装与 create-react-app 创建的配置文件不兼容的最新版本的 ESlint！

</div>

