---
mainImage: ../../../images/part-6.svg
part: 6
letter: e
lang: zh
---

<div class="tasks">

<!-- **NOTE**: this is the old ending section of the 6 part that has 30th January 2023 been replaced with material about [React Query, useReducer and context](/en/part6/react_query_use_reducer_and_the_context). This section remains here for a couple of weeks.-->
**注意**：这是之前六部分的结束部分，已于2023年1月30日被关于[React Query，useReducer和context](/en/part6/react_query_use_reducer_and_the_context)的材料所取代。本节内容将在几周内保留。

<!-- If you have started with the exercises (6.19-6.21) that use the Redux connect you may continue with those. If you have not yet started, I recommend to proceed with the new section.-->
如果你已经开始使用Redux connect的练习（6.19-6.21），你可以继续这些练习。如果你还没有开始，我建议你继续新的章节。
</div>

<div class="content">

###

<!-- So far we have used our Redux store with the help of the [hook](https://react-redux.js.org/api/hooks) API from react-redux.-->
所以到目前为止，我们已经使用了[钩子](https://react-redux.js.org/api/hooks) API 来帮助我们的 Redux 存储。
<!-- Practically this has meant using the [useSelector](https://react-redux.js.org/api/hooks#useselector) and [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) functions.-->
实际上，这意味着使用[useSelector](https://react-redux.js.org/api/hooks#useselector)和[useDispatch](https://react-redux.js.org/api/hooks#usedispatch)函数。

<!-- To finish this part we will look into another older and more complicated way to use Redux, the [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md) function provided by react-redux.-->
完成这一部分，我们将研究另一种更旧、更复杂的使用Redux的方法，即react-redux提供的[connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md)函数。

<i>**In new applications, use the hook API**</i>. Knowing how to use connect though is useful when maintaining older projects using Redux.

### Using the connect function to share the Redux store to components

<!-- Let''s modify the <i>Notes</i> component so that instead of using the hook API (the *useDispatch* and  *useSelector* functions ) it uses the *connect* function.-->
让我们修改<i>Notes</i>组件，使用*connect*函数而不是使用hook API（*useDispatch*和*useSelector*函数）。
<!-- We have to modify the following parts of the component:-->
我们必须修改组件的以下部分：

````js
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // highlight-start
  const dispatch = useDispatch()
  const notes = useSelector(({filter, notes}) => {
    if ( filter === 'ALL' ) {
      return notes
    }
    return filter === 'IMPORTANT'
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })
  // highlight-end

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}

export default Notes
````

<!-- The *connect* function can be used for transforming "regular" React components so that the state of the Redux store can be "mapped" into the component''s props.-->
使用*connect*函数可以用于转换“常规”React组件，以便将Redux存储中的状态“映射”到组件的props中。

<!-- Let''s first use the connect function to transform our <i>Notes</i> component into a <i>connected component</i>:-->
让我们首先使用连接功能将我们的<i>笔记</i>组件转换成<i>连接组件</i>：

```js
import { connect } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // ...
}

const ConnectedNotes = connect()(Notes) // highlight-line
export default ConnectedNotes           // highlight-line
```

<!-- The module exports the <i>connected component</i> that works exactly like the previous regular component for now.-->
模块导出<i>连接组件</i>，它现在的工作方式完全和之前的普通组件一样。

<!-- The component needs the list of notes and the value of the filter from the Redux store. The *connect* function accepts a so-called [mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapstatetoprops-state-ownprops--object) function as its first parameter. The function can be used for defining the props of the <i>connected component</i> that are based on the state of the Redux store.-->
该组件需要从Redux存储中获取笔记列表和过滤器的值。*connect*函数接受所谓的[mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapstatetoprops-state-ownprops--object)函数作为其第一个参数。该函数可用于定义基于Redux存储状态的<i>连接组件</i>的props。

<!-- If we define:-->
若我們定義：

1. Success as being happy

1. 成功就是快樂

2. Failure as being unhappy

2. 失敗就是不快樂

```js
const Notes = (props) => { // highlight-line
  const dispatch = useDispatch()

// highlight-start
  const notesToShow = () => {
    if ( props.filter === 'ALL' ) {
      return props.notes
    }

    return props.filter  === 'IMPORTANT'
      ? props.notes.filter(note => note.important)
      : props.notes.filter(note => !note.important)
  }
  // highlight-end

  return(
    <ul>
      {notesToShow().map(note => // highlight-line
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

const ConnectedNotes = connect(mapStateToProps)(Notes) // highlight-line

export default ConnectedNotes
```

<!-- The <i>Notes</i> component can access the state of the store directly, e.g. through <i>props.notes</i> contains the list of notes.  Similarly, <i>props.filter</i> references the value of the filter.-->
<i>Notes</i> 组件可以直接访问存储的状态，例如通过 <i>props.notes</i> 可以获取笔记列表。类似地，<i>props.filter</i> 引用了过滤器的值。

<!-- The situation that results from using <i>connect</i> with the <i>mapStateToProps</i> function we defined can be visualized like this:-->
这种使用我们定义的<i>connect</i>和<i>mapStateToProps</i>函数产生的情况可以这样可视化：

![diagram notelist and filter connected to redux store](../../images/6/24c.png)

<!-- The <i>Notes</i> component has "direct access" via <i>props.notes</i> and <i>props.filter</i> for inspecting the state of the Redux store.-->
<i>Notes</i> 组件通过 <i>props.notes</i> 和 <i>props.filter</i> 直接访问，以检查 Redux 存储状态。

<!-- The *NoteList* component does not need the information about which filter is selected, so we can move the filtering logic elsewhere.-->
*NoteList* 组件不需要有关哪个过滤器被选中的信息，因此我们可以把过滤逻辑放在其他地方。
<!-- We just have to give it correctly filtered notes in the *notes* prop:-->
我們只需要在*notes* prop中提供正確篩選過的筆記：

```js
const Notes = (props) => {
  const dispatch = useDispatch()

  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

// highlight-start
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
    )
  }
}
// highlight-end

const ConnectedNotes = connect(mapStateToProps)(Notes)
export default ConnectedNotes
```

### mapDispatchToProps

<!-- Now we have gotten rid of *useSelector*, but <i>Notes</i> still uses the *useDispatch* hook and the *dispatch* function returning it:-->
现在我们已经摆脱了*useSelector*，但<i>Notes</i>仍然使用*useDispatch*钩子和*dispatch*函数返回它：

```js
const Notes = (props) => {
  const dispatch = useDispatch() // highlight-line

  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}
```

<!-- The second parameter of the *connect* function can be used for defining [mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapdispatchtoprops-object--dispatch-ownprops--object) which is a group of <i>action creator</i> functions passed to the connected component as props. Let''s make the following changes to our existing connect operation:-->
第二个参数*connect*函数可以用于定义[mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapdispatchtoprops-object--dispatch-ownprops--object)，它是一组<i>action creator</i>函数，作为props传递给连接的组件。让我们对我们现有的连接操作做出以下更改：

```js
const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

// highlight-start
const mapDispatchToProps = {
  toggleImportanceOf,
}
// highlight-end

const ConnectedNotes = connect(
  mapStateToProps,
  mapDispatchToProps // highlight-line
)(Notes)

export default ConnectedNotes
```

<!-- Now the component can directly dispatch the action defined by the *toggleImportanceOf* action creator by calling the function through its props:-->
现在组件可以通过调用其props中定义的*toggleImportanceOf* action creator函数直接调度动作：

```js
const Notes = (props) => {
  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}
```

<!-- This means that instead of dispatching the action like this:-->
这意味着，不是像这样分派行动：

```js
dispatch(toggleImportanceOf(note.id))
```

<!-- When using *connect* we can simply do this:-->
当使用*连接*时，我们可以简单地这样做：

```js
props.toggleImportanceOf(note.id)
```

<!-- There is no need to call the *dispatch* function separately since *connect* has already modified the *toggleImportanceOf* action creator into a form that contains the dispatch.-->
无需单独调用*dispatch*函数，因为*connect*已经将*toggleImportanceOf*动作创建者修改成一种包含dispatch的形式。

<!-- It can take some time to wrap your head around how *mapDispatchToProps* works, especially once we take a look at an [alternative way of using it](/en/part6/connect_the_old_part#an-alternative-way-of-using-map-dispatch-to-props).-->
它可能需要一些时间来理解*mapDispatchToProps*是如何工作的，特别是当我们查看[另一种使用它的方式](/en/part6/connect_the_old_part#an-alternative-way-of-using-map-dispatch-to-props)时。

<!-- The resulting situation from using *connect* can be visualized like this:-->
结果使用*连接*的情况可以这样可视化：

![diagram showing toggle connecting to state in redux and dispatch inside of redux](../../images/6/25b.png)

<!-- In addition to accessing the store''s state via <i>props.notes</i> and <i>props.filter</i>, the component also references a function that can be used for dispatching <i>notes/toggleImportanceOf</i>-type actions via its <i>toggleImportanceOf</i> prop.-->
此外，除了通过<i>props.notes</i>和<i>props.filter</i>访问存储状态外，该组件还引用了一个可用于通过其<i>toggleImportanceOf</i> prop调度<i>notes/toggleImportanceOf</i>类型操作的函数。

<!-- The code for the newly refactored <i>Notes</i> component looks like this:-->
<i>笔记</i>组件的新重构代码如下：

```js
import { connect } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = (props) => {
  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT'
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

<!-- Let''s also use *connect* to create new notes:-->
让我们也使用*连接*来创建新的笔记：

```js
import { connect } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NewNote = (props) => { // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

// highlight-start
export default connect(
  null,
  { createNote }
)(NewNote)
// highlight-end
```

<!-- Since the component does not need to access the store''s state, we can simply pass <i>null</i> as the first parameter to *connect*.-->
由于组件不需要访问存储库的状态，我们可以将<i>null</i>作为第一个参数传递给*connect*。

<!-- You can find the code for our current application in its entirety in the <i>part6-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5)的<i>part6-5</i>分支中找到我们当前应用程序的完整代码。

### Referencing action creators passed as props

<!-- Let''s direct our attention to one interesting detail in the <i>NewNote</i> component:-->
让我们将注意力转向<i>NewNote</i>组件中一个有趣的细节：

```js
import { connect } from 'react-redux'
import { createNote } from '../reducers/noteReducer'  // highlight-line

const NewNote = (props) => {

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)  // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(
  null,
  { createNote }  // highlight-line
)(NewNote)
```

<!-- Developers who are new to connect may find it puzzling that there are two versions of the <i>createNote</i> action creator in the component.-->
开发人员如果是初次接触connect，可能会觉得奇怪，因为组件中有两个版本的<i>createNote</i> action creator。

<!-- The function must be referenced as <i>props.createNote</i> through the component''s props, as this is the version that <i>contains the automatic dispatch</i> added by *connect*.-->
函数必须通过组件的props引用为<i>props.createNote</i>，因为这是由*connect*添加的带有自动分发的版本。

<!-- Due to the way that the action creator is imported:-->
由于动作创建者的导入方式：

```js
import { createNote } from './../reducers/noteReducer'
```

<!-- The action creator can also be referenced directly by calling *createNote*. You should not do this, since this is the unmodified version of the action creator that does not contain the added automatic dispatch.-->
调用*createNote*也可以直接引用action creator，但不应这样做，因为这是没有添加自动分发的未修改版本的action creator。

<!-- If we print the functions to the console from the code (we have not yet looked at this useful debugging trick):-->
如果我們從代碼中打印出功能到控制台（我們還沒有看到這個有用的調試技巧）：

```js
const NewNote = (props) => {
  console.log(createNote)
  console.log(props.createNote)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  // ...
}
```

<!-- We can see the difference between the two functions:-->
我们可以看到两个函数之间的区别：

![devtools console of two functions](../../images/6/10.png)

<!-- The first function is a regular <i>action creator</i> whereas the second function contains the additional dispatch to the store that was added by connect.-->
第一个函数是一个常规的<i>动作创建者</i>，而第二个函数包含了由connect添加到存储中的额外dispatch。

<!-- Connect is an incredibly useful tool although it may seem difficult at first due to its level of abstraction.-->
连接是一个非常有用的工具，尽管由于其抽象程度可能一开始会有些困难。

### An alternative way of using mapDispatchToProps

<!-- We defined the function for dispatching actions from the connected <i>NewNote</i> component in the following way:-->
我们以下面的方式定义了从连接的<i>NewNote</i>组件分发动作的函数：

```js
const NewNote = () => {
  // ...
}

export default connect(
  null,
  { createNote }
)(NewNote)
```

<!-- The connect expression above enables the component to dispatch actions for creating new notes with the <code>props.createNote('a new note')</code> command.-->
以上的连接表达式使组件能够使用<code>props.createNote('a new note')</code>命令来分发创建新笔记的动作。

<!-- The functions passed in <i>mapDispatchToProps</i> must be <i>action creators</i>, that is, functions that return Redux actions.-->
<i>mapDispatchToProps</i> 传入的函数必须是<i>action creators</i>，即返回Redux actions的函数。

<!-- It is worth noting that the <i>mapDispatchToProps</i> parameter is a <i>JavaScript object</i>, as the definition:-->
注意，<i>mapDispatchToProps</i> 参数是一个<i>JavaScript 对象</i>，定义如下：

```js
{
  createNote
}
```

<!-- Is just shorthand for defining the object literal:-->
`{}` 就是简写的定义对象字面量的方式。

```js
{
  createNote: createNote
}
```

<!-- Which is an object that has a single <i>createNote</i> property with the <i>createNote</i> function as its value.-->
这是一个具有单个<i>createNote</i>属性，其值为<i>createNote</i>函数的对象。

<!-- Alternatively, we could pass the following <i>function</i> definition as the second parameter to *connect*:-->
我們也可以將以下<i>函數</i>定義作為第二個參數傳遞給*connect*：

```js
const NewNote = (props) => {
  // ...
}

// highlight-start
const mapDispatchToProps = dispatch => {
  return {
    createNote: value => {
      dispatch(createNote(value))
    },
  }
}
// highlight-end

export default connect(
  null,
  mapDispatchToProps
)(NewNote)
```

<!-- In this alternative definition, <i>mapDispatchToProps</i> is a function that *connect* will invoke by passing to it the *dispatch* function as its parameter. The return value of the function is an object that defines a group of functions that get passed to the connected component as props. Our example defines the function passed as the <i>createNote</i> prop:-->
在这个替代定义中，<i>mapDispatchToProps</i> 是一个函数，*connect* 通过将 *dispatch* 函数作为参数来调用它。该函数的返回值是一个定义了一组函数的对象，这些函数将作为props传递给连接的组件。我们的示例定义了被作为<i>createNote</i> prop传递的函数：

```js
value => {
  dispatch(createNote(value))
}
```

<!-- Which simply dispatches the action created with the <i>createNote</i> action creator.-->
使用<i>createNote</i>动作创建者简单地调度动作。

<!-- The component then references the function through its props by calling <i>props.createNote</i>:-->
组件然后通过调用<i>props.createNote</i>通过其props引用该函数：

```js
const NewNote = (props) => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

<!-- The concept is quite complex and describing it through text is challenging. In most cases, it is sufficient to use the simpler form of <i>mapDispatchToProps</i>. However, there are situations where a more complicated definition is necessary, like if the <i>dispatched actions</i> need to reference [the props of the component](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931).-->
概念相当复杂，通过文字描述起来很具有挑战性。在大多数情况下，使用更简单的<i>mapDispatchToProps</i>形式就足够了。但是，有时候需要一个更复杂的定义，比如<i>dispatched actions</i>需要引用[组件的props](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931)。

<!-- The creator of Redux Dan Abramov has created a wonderful tutorial called [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) that you can find on Egghead.io. I highly recommend the tutorial to everyone. The last four videos discuss the *connect* method, particularly the more "complicated" way of using it.-->
Dan Abramov创造了一个叫做[Getting started with Redux](https://egghead.io/courses/getting-started-with-redux)的精彩教程，你可以在Egghead.io上找到它。我强烈推荐这个教程给大家。最后四个视频讨论了*connect*方法，尤其是更"复杂"的使用方式。

### Presentational/Container revisited

<!-- The refactored <i>Notes</i> component is almost entirely focused on rendering notes and is quite close to being a so-called [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). According to the [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) provided by Dan Abramov, presentational components:-->
重构后的<i>笔记</i>组件几乎完全专注于渲染笔记，几乎等同于所谓的[展示组件](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)。根据丹·阿布拉莫夫（Dan Abramov）提供的[描述](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)，展示组件：

<!-- - Are concerned with how things look.-->
- 关心事物的外观。
<!-- - May contain both presentational and container components inside, and usually have some DOM markup and styles of their own.-->
可以在里面包含展示型和容器型组件，通常会有一些自己的DOM标记和样式。
<!-- - Often allow containment via props.children.-->
通常通过props.children允许封装。
<!-- - Have no dependencies on the rest of the app, such as Redux actions or stores.-->
沒有依賴其他應用程序，如Redux動作或商店。
<!-- - Don’t specify how the data is loaded or mutated.-->
不要指定数据如何被加载或变更。
<!-- - Receive data and callbacks exclusively via props.-->
接收数据和回调仅通过props。
<!-- - Rarely have their own state (when they do, it’s UI state rather than data).-->
他们很少拥有自己的状态（如果有的话，那是UI状态而不是数据）。
<!-- - Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.-->
除非它們需要狀態、生命週期鉤子或性能優化，否則會以功能組件的形式書寫。

<!-- The *connected component* that is created with the *connect* function:-->
*连接组件*，通过*连接*函数创建：

```js
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT'
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

<!-- Fits the description of a <i>container</i> component. According to the [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) provided by Dan Abramov, container components:-->
<i>容器</i> 组件符合描述。根据丹·阿布拉莫夫（Dan Abramov）提供的[描述](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)，容器组件：

<!-- - Are concerned with how things work.-->
- 担心如何使事情运作。
<!-- - May contain both presentational and container components inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.-->
可能同时包含表示性和容器组件，但通常不会有任何自己的DOM标记，除了一些包装divs，而且从不有任何样式。
<!-- - Provide the data and behavior to presentational or other container components.-->
提供数据和行为以展示或其他容器组件。
<!-- - Call Redux actions and provide these as callbacks to the presentational components.-->
调用Redux动作并将它们提供给呈现组件作为回调函数。
<!-- - Are often stateful, as they tend to serve as data sources.-->
- 常常是有状态的，因为它们往往充当数据源。
<!-- - Are usually generated using higher-order components such as connect from React Redux, rather than written by hand.-->
通常使用更高级别的组件（比如来自React Redux的connect）来生成，而不是手写。

<!-- Dividing the application into presentational and container components is one way of structuring React applications that has been deemed beneficial. The division may be a good design choice or it may not, it depends on the context.-->
将应用程序分成表现型组件和容器组件是一种有益的结构React应用程序的方式。这种划分可能是一个良好的设计选择，也可能不是，这取决于上下文。

<!-- Abramov attributes the following [benefits](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) to the division:-->
阿布拉莫夫将以下好处归因于这种划分：[好处](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

<!-- - Better separation of concerns. You understand your app and your UI better by writing components this way.-->
- 更好的分离关注点。通过这种方式编写组件，您可以更好地理解应用程序和用户界面。
<!-- - Better reusability. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused.-->
- 更好的可重用性。您可以使用完全不同的状态源使用相同的呈现组件，并将其转换为可以进一步重用的容器组件。
<!-- - Presentational components are essentially your app’s “palette”. You can put them on a single page and let the designer tweak all their variations without touching the app’s logic. You can run screenshot regression tests on that page.-->
- 组件呈现本质上是你的应用程序的“调色板”。您可以将它们放在一个页面上，让设计师调整所有变化而不影响应用程序的逻辑。您可以在该页面上运行屏幕截图回归测试。

<!-- Abramov mentions the term [higher-order component](https://reactjs.org/docs/higher-order-components.html). The <i>Notes</i> component is an example of a regular component, whereas the <i>connect</i> method provided by React-Redux is an example of a <i>high-order component</i>. Essentially, a higher-order component is a function that accepts a "regular" component as its parameter, which then returns a new "regular" component as its return value.-->
阿布拉莫夫提到了术语[高阶组件](https://reactjs.org/docs/higher-order-components.html)。<i>Notes</i>组件是一个常规组件的示例，而React-Redux提供的<i>connect</i>方法则是<i>高阶组件</i>的示例。从本质上讲，高阶组件是一个接受“常规”组件作为其参数的函数，该函数会返回一个新的“常规”组件作为其返回值。

<!-- Higher-order components, or HOCs, are a way of defining generic functionality that can be applied to components. This is a concept from functional programming that very slightly resembles inheritance in object-oriented programming.-->
Higher-order 组件，或 HOCs，是一种定义可应用于组件的通用功能的方式。 这是一种来自函数编程的概念，与面向对象编程中的继承略有相似。

<!-- HOCs are a generalization of the [Higher-Order Function](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) concept. HOFs are functions that either accept functions as parameters or return functions. We have been using HOFs throughout the course, e.g. all of the methods used for dealing with arrays like *map, filter and find* are HOFs.-->
HOCs 是[高阶函数](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) 概念的概括。HOFs 是接受函数作为参数或返回函数的函数。我们在整个课程中一直在使用HOFs，例如处理数组的所有方法，如*map、filter 和 find* 都是HOFs。

<!-- Reactin hook-apin ilmestymisen jälkeen HOC:ien suosio on kääntynyt laskuun, ja melkein kaikki kirjastot, joiden käyttö on aiemmin perustunut HOC:eihin on saanut hook-perustaisen apin. Useimmiten , kuten myös reduxin kohdalla, hook-perustaiset apit ovat HOC-apeja huomattavasti yksinkertaisempia. -->
<!-- After the React hook API was published, HOCs have become less and less popular. Almost all libraries which used to be based on HOCs have now been modified to use hooks. Most of the time hook-based APIs are a lot simpler than HOC-based ones, as is the case with Redux as well.-->
在 React hook API 发布后，高阶组件（HOCs）的流行程度已经越来越低。几乎所有曾经基于 HOCs 的库都已经被修改为使用 hooks。大多数情况下，基于 hook 的 API 比基于 HOC 的要简单得多，Redux 也是如此。

### Redux and the component state

<!-- We have come a long way in this course and, finally, we have come to the point at which we are using React "the right way", meaning React only focuses on generating the views, and the application state is wholly separated from the React components and passed on to Redux, its actions, and its reducers.-->
我们在这门课程中走了一段很长的路，最终，我们来到了使用React“正确的方式”的点，这意味着React只关注于生成视图，应用状态完全与React组件分离，并传递给Redux，它的actions和它的reducers。

<!-- What about the *useState* hook, which provides components with their own state? Does it have any role if an application is using Redux or some other external state management solution? If the application has more complicated forms, it may be beneficial to implement their local state using the state provided by the *useState* function. One can, of course, have Redux manage the state of the forms, however, if the state of the form is only relevant when filling the form (e.g. for validation) it may be wise to leave the management of state to the component responsible for the form.-->
**那么*useState*钩子(hook)，它为组件提供自己的状态，在应用程序使用Redux或其他外部状态管理解决方案时有什么作用？如果应用程序具有更复杂的表单，则使用*useState*函数提供的状态来实现其本地状态可能是有益的。当然，可以让Redux管理表单的状态，但是，如果表单的状态仅在填写表单时才相关(例如用于验证)，那么将状态管理留给负责表单的组件可能是明智的选择。

<!-- Should we always use Redux? Probably not. Dan Abramov, the developer of Redux, discusses this in his article [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367).-->
**应该我们总是使用Redux吗？可能不是。Redux的开发者Dan Abramov在他的文章《你可能不需要Redux》（[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)）中讨论了这个问题。**

<!-- Nowadays it is possible to implement Redux-like state management without Redux by using the React [context](https://reactjs.org/docs/context.html) api and the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook.-->
現在可以通過使用React [context](https://reactjs.org/docs/context.html) api和[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook來實現類似Redux的狀態管理，而不需要Redux。
<!-- More about this [here](https://www.simplethread.com/cant-replace-redux-with-hooks/) and [here](https://hswolff.com/blog/how-to-usecontext-with-usereducer/). We will also practice this in-->
class.

关于此[这里](https://www.simplethread.com/cant-replace-redux-with-hooks/)和[这里](https://hswolff.com/blog/how-to-usecontext-with-usereducer/)更多信息。我们也将在课堂上练习这个。
<!-- [part 9](/en/part9).-->
# 第九部分

现在你已经准备好了，你可以开始投资了。

# 第九部分

现在你已经准备好了，你可以开始投资了。

</div>

<div class="tasks">

### Exercises 6.19.-6.21

<!-- **NOTE**: this is the old ending section of the 6 part that has 30th January 2023 been replaced with material about [React Query, useReducer and context](/en/part6/react_query_use_reducer_and_the_contex). This section remains here for a couple of weeks.-->
**注意**：此部分已于2023年1月30日被[React Query，useReducer和context](/en/part6/react_query_use_reducer_and_the_contex)的内容所取代，暂时保留几周。

<!-- If you have started with the exercises that use the Redux connect you may continue with those. If you have not yet started, I recommend to proceed with the new section.-->
如果你已经开始使用Redux connect的练习，你可以继续这些练习。如果你还没有开始，我建议你继续新的章节。

#### 6.19 anecdotes and connect, step1

<!-- The <i>redux store</i> is currently being accessed by the components through the <em>useSelector</em> and <em>useDispatch</em> hooks.-->
<i>Redux Store</i> 目前正通过 <em>useSelector</em> 和 <em>useDispatch</em> 钩子被组件访问。

<!-- Modify the <i>Notification</i> component so that it uses the *connect* function instead of the hooks.-->
修改<i>通知</i>组件，使其使用*connect*函数而不是hooks。

#### 6.20 anecdotes and connect, step2

<!-- Do the same for the <i>Filter</i> and <i>AnecdoteForm</i> components.-->
给<i>Filter</i>和<i>AnecdoteForm</i>组件也做同样的事情。

#### 6.21 anecdotes, the grand finale

<!-- You (probably) have one nasty bug in your application. If the user clicks the vote button multiple times in a row, the notification is displayed funnily. For example, if a user votes twice in three seconds,-->
the notification says: "You voted twice in three seconds."

你（可能）在你的应用程序中有一个讨厌的错误。如果用户连续多次点击投票按钮，通知会以有趣的方式显示。例如，如果用户在三秒钟内投票两次，通知会显示：“你在三秒钟内投票了两次。”
<!-- the last notification is only displayed for two seconds (assuming the notification is normally shown for 5 seconds). This happens because removing the first notification accidentally removes the second notification.-->
最后一条通知只显示了两秒钟（假设通知通常显示5秒钟）。这是因为不小心移除了第一条通知，也移除了第二条通知。

<!-- Fix the bug so that after multiple votes in a row, the notification for the last vote is displayed for five seconds.-->
修复这个 bug，以便在连续投票后，最后一次投票的通知将显示五秒钟。

<!-- The fix can be done by canceling the previous notification when a new notification is displayed, whenever necessary.-->
可以根据需要，在显示新通知时取消之前的通知以完成修复。
<!-- The [documentation](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) for the setTimeout function might also be useful for this.-->
[文档](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)关于setTimeout函数也可能对此有用。

<!-- This was the last exercise for this part of the course and it''s time to push your code to GitHub and mark all of your completed exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本部分课程的最后一个练习，现在是时候把你的代码推送到GitHub，并把你完成的所有练习提交到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)了。

</div>
