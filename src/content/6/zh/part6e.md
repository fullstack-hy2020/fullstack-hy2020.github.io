---
mainImage: ../../../images/part-6.svg
part: 6
letter: e
lang: zh
---



<div class="tasks">
<!--**NOTE**: this is the old ending section of the 6 part that has 30th January 2023 been replaced with material about [React Query, useReducer and context](/en/part6/react_query_use_reducer_and_the_contex). This section remains here for a couple of weeks.-->
**注意**: 本章作为旧版第 6 部分的结束章节，已经在2023年1月30日被替换为“ [React Query, useReducer 和 context](/zh/part6/react_query_use_reducer_and_the_context)“。这一章将仅在此保留几周。

<!--If you have started with the exercises (6.19-6.21) that use the Redux connect you may continue with those. If you have not yet started, I recommend to proceed with the new section.-->

如果你已经用 Redux 的 connect 方法开始了 6.19 - 6.21 的练习，你可以继续将它完成。但如果你还没有开始，我建议你从更新后的新章节开始。

</div>

<div class="content">

###

<!-- So far we have used our redux-store with the help of the [hook](https://react-redux.js.org/api/hooks)-api from react-redux.-->
 到目前为止，我们在react-redux的[hook](https://react-redux.js.org/api/hooks)-api的帮助下使用我们的redux-store。
<!-- Practically this has meant using the [useSelector](https://react-redux.js.org/api/hooks#useselector) and [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) functions.-->
 实际上这意味着使用[useSelector](https://react-redux.js.org/api/hooks#useselector)和[useDispatch](https://react-redux.js.org/api/hooks#usedispatch)函数。

<!-- To finish this part we will look into another older and  more complicated way to use redux, the [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md)-function provided by react-redux.-->
 为了完成这一部分，我们将研究另一种更古老、更复杂的使用redux的方式，即 react-redux 提供的 [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md) 函数。

<i>**In new applications you should absolutely use the hook-api**</i>, but knowing how to use connect is useful when maintaining older projects using redux.

### Using the connect-function to share the redux store to components

<!-- Let's modify the <i>Notes</i> component so that instead of using the hook-api (the *useDispatch* and  *useSelector* functions ) it uses the *connect*-function.-->
 让我们修改<i>Notes</i>组件，使其不再使用hook-api（*useDispatch* 和 *useSelector* 函数）而是使用 *connect* 函数。
<!-- We have to modify the following parts of the component:-->
 我们必须修改该组件的以下部分。

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

<!-- The *connect* function can be used for transforming "regular" React components so that the state of the Redux store can be "mapped" into the component's props.-->
 *connect* 函数可以用来转换 "常规 "的React组件，这样Redux商店的状态就可以 "映射 "到组件的props中。

<!-- Let's first use the connect function to transform our <i>Notes</i> component into a <i>connected component</i>:-->
 让我们首先使用connect函数将我们的<i>Notes</i>组件转换成<i>connected component</i>。

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
 该模块导出了<i>连接组件</i>，其工作原理与之前的普通组件完全相同。

<!-- The component needs the list of notes and the value of the filter from the Redux store. The *connect* function accepts a so-called [mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapstatetoprops-state-ownprops--object) function as its first parameter. The function can be used for defining the props of the <i>connected component</i> that are based on the state of the Redux store.-->
 该组件需要Redux商店中的笔记列表和过滤器的值。*connect*函数接受一个所谓的[mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapstatetoprops-state-ownprops--object)函数作为其第一个参数。该函数可用于定义<i>连接组件的prop</i>，这些prop是基于Redux商店的状态。

<!-- If we define:-->
 如果我们定义。


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

<!-- The <i>Notes</i> component can access the state of the store directly, e.g. through <i>props.notes</i> that contains the list of notes.  Similarly, <i>props.filter</i> references the value of the filter.-->
 <i>Notes</i>组件可以直接访问商店的状态，例如，通过包含笔记列表的<i>props.notes</i>。  类似地，<i>props.filter</i>引用过滤器的值。

<!-- The situation that results from using <i>connect</i> with the <i>mapStateToProps</i> function we defined can be visualized like this:-->
 使用<i>connect</i>和我们定义的<i>mapStateToProps</i>函数所产生的情况可以这样可视化。

![](../../images/6/24c.png)


<!-- The <i>Notes</i> component has "direct access" via <i>props.notes</i> and <i>props.filter</i> for inspecting the state of the Redux store.-->
 <i>Notes</i>组件可以通过<i>props.notes</i>和<i>props.filter</i>"直接访问 "Redux商店的状态。

<!-- The *NoteList* component actually does not need the information about which filter is selected, so we can move the filtering logic elsewhere.-->
 *NoteList*组件实际上不需要关于哪个过滤器被选中的信息，所以我们可以将过滤逻辑移到其他地方。
<!-- We just have to give it correctly filtered notes in the *notes* prop:-->
 我们只需要在*notes*prop中给它正确的过滤的笔记。

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
 现在我们已经摆脱了*useSelector*，但是<i>Notes</i>仍然使用*useDispatch*钩子和返回它的*dispatch*函数。

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

<!-- The second parameter of the *connect* function can be used for defining [mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapdispatchtoprops-object--dispatch-ownprops--object) which is a group of <i>action creator</i> functions passed to the connected component as props. Let's make the following changes to our existing connect operation:-->
 *connect*函数的第二个参数可用于定义[mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapdispatchtoprops-object--dispatch-ownprops--object)，这是一组<i>action creator</i>函数，作为props传递给连接的组件。让我们对我们现有的连接操作做如下修改。


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
 现在，组件可以直接调度由*toggleImportanceOf*动作创建者定义的动作，通过其props调用该函数。

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
 这意味着，不再像这样调度动作了。

```js
dispatch(toggleImportanceOf(note.id))
```

<!-- When using *connect* we can simply do this:-->
 当使用*connect*时，我们可以简单地这样做。

```js
props.toggleImportanceOf(note.id)
```

<!-- There is no need to call the *dispatch* function separately since *connect* has already modified the *toggleImportanceOf* action creator into a form that contains the dispatch.-->
 没有必要单独调用*dispatch*函数，因为*connect*已经将*toggleImportanceOf*动作创建者修改为包含调度的形式。

<!-- It can take some to time to wrap your head around how _mapDispatchToProps_ works, especially once we take a look at an [alternative way of using it](/en/part6/connect_the_old_part#an-alternative-way-of-using-map-dispatch-to-props).-->
 你可能需要一些时间来理解_mapDispatchToProps_的工作原理，尤其是当我们看了一个[使用它的替代方法](/en/part6/connect_the_old_part#an-alternative-way-of-using-map-dispatch-to-props)。

<!-- The resulting situation from using *connect* can be visualized like this:-->
 使用*connect*所产生的情况可以被可视化为这样。

![](../../images/6/25b.png)

<!-- In addition to accessing the store's state via <i>props.notes</i> and <i>props.filter</i>, the component also references a function that can be used for dispatching <i>notes/toggleImportanceOf</i>-type actions via its <i>toggleImportanceOf</i> prop.-->
 除了通过<i>props.notes</i>和<i>props.filter</i>访问商店的状态外，该组件还引用了一个函数，该函数可用于通过其<i>toggleImportanceOf</i>prop调度<i>notes/toggleImportanceOf</i>型动作。

<!-- The code for the newly refactored <i>Notes</i> component looks like this:-->
 新重构的<i>Notes</i>组件的代码如下所示：

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

<!-- Let's also use *connect* to create new notes:-->
 让我们也使用*connect*来创建新的笔记。

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

<!-- Since the component does not need to access the store's state, we can simply pass <i>null</i> as the first parameter to *connect*.-->
 由于该组件不需要访问商店的状态，我们可以简单地传递<i>null</i>作为*connect*的第一个参数。


<!-- You can find the code for our current application in its entirety in the <i>part6-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5).-->
 你可以在[这个Github仓库](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5)的<i>part6-5</i>分支中找到我们当前应用的全部代码。

### Referencing action creators passed as props

<!-- Let's direct our attention to one interesting detail in the <i>NewNote</i> component:-->
 让我们注意一下<i>NewNote</i>组件中一个有趣的细节。

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
 初次接触连接的开发者可能会发现，组件中的<i>createNote</i>动作创建者有两个版本，这令人费解。

<!-- The function must be referenced as <i>props.createNote</i> through the component's props, as this is the version that <i>contains the automatic dispatch</i> added by *connect*.-->
 该函数必须通过组件的props被引用为<i>props.createNote</i>，因为这是<i>包含*connect*添加的自动调度</i>的那个版本。

<!-- Due to the way that the action creator is imported:-->
 由于动作创建者的导入方式。

```js
import { createNote } from './../reducers/noteReducer'
```
<!-- The action creator can also be referenced directly by calling *createNote*. You should not do this, since this is the unmodified version of the action creator that does not contain the added automatic dispatch.-->
 也可以通过调用*createNote*直接引用动作创建者。你不应该这样做，因为这是未经修改的动作创建者的版本，不包含添加的自动调度。

<!-- If we print the functions to the console from the code (we have not yet looked at this useful debugging trick):-->
 如果我们从代码中把这些函数打印到控制台（我们还没有看这个有用的调试技巧）。

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
 我们可以看到这两个函数之间的区别。

![](../../images/6/10.png)

<!-- The first function is a regular <i>action creator</i> whereas the second function contains the additional dispatch to the store that was added by connect.-->
 第一个函数是一个普通的<i>动作创建者</i>，而第二个函数则包含了由connect添加的对存储的额外调度。

<!-- Connect is an incredibly useful tool although it may seem difficult at first due to its level of abstraction.-->
 Connect是一个非常有用的工具，尽管由于它的抽象程度，一开始可能看起来很困难。

### Alternative way of using mapDispatchToProps

<!-- We defined the function for dispatching actions from the connected <i>NewNote</i> component in the following way:-->
 我们以如下方式定义了用于从连接的<i>NewNote</i>组件中调度动作的函数。

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
 上面的连接表达式使该组件能够通过<code>props.createNote("a new note")</code>命令来调度创建新笔记的动作。


<!-- The functions passed in <i>mapDispatchToProps</i> must be <i>action creators</i>, that is, functions that return Redux actions.-->
 <i>mapDispatchToProps</i>中传递的函数必须是<i>action creators</i>，也就是返回Redux动作的函数。


<!-- It is worth noting that the <i>mapDispatchToProps</i> parameter is a <i>JavaScript object</i>, as the definition:-->
 值得注意的是，<i>mapDispatchToProps</i>参数是一个<i>JavaScript对象</i>，正如其定义。

```js
{
  createNote
}
```

<!-- Is just shorthand for defining the object literal:-->
 这只是定义对象字面的速记。

```js
{
  createNote: createNote
}
```

<!-- Which is an object that has a single <i>createNote</i> property with the <i>createNote</i> function as its value.-->
 这是一个具有单一的<i>createNote</i>属性的对象，其值为<i>createNote</i>函数。

<!-- Alternatively, we could pass the following <i>function</i> definition as the second parameter to *connect*:-->
 另外，我们可以把下面的<i>函数</i>定义作为第二个参数传递给 *connect*。

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


<!-- In this alternative definition, <i>mapDispatchToProps</i> is a function that *connect* will invoke by passing it the *dispatch*-function as its parameter. The return value of the function is an object that defines a group of functions that get passed to the connected component as props. Our example defines the function passed as the <i>createNote</i> prop:-->
 在这个替代定义中，<i>mapDispatchToProps</i>是一个函数，*connect*将把*dispatch*-函数作为其参数传递给它，从而调用该函数。该函数的返回值是一个定义了一组函数的对象，这些函数被作为prop传递给连接的组件。我们的例子定义了作为<i>createNote</i>prop传递的函数。

```js
value => {
  dispatch(createNote(value))
}
```

<!-- Which simply dispatches the action created with the <i>createNote</i> action creator.-->
 它简单地分配了用<i>createNote</i>动作创建器创建的动作。

<!-- The component then references the function through its props by calling <i>props.createNote</i>:-->
 然后组件通过它的prop调用<i>props.createNote</i>来引用这个函数。

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

<!-- The concept is quite complex and describing it through text is challenging. In most cases it is sufficient to use the simpler form of <i>mapDispatchToProps</i>. However, there are situations where the more complicated definition is necessary, like if the <i>dispatched actions</i> need to reference [the props of the component](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931).-->
 这个概念相当复杂，通过文字来描述它是有难度的。在大多数情况下，使用<i>mapDispatchToProps</i>的较简单形式就足够了。然而，在某些情况下，更复杂的定义是必要的，例如，如果<i>dispatched actions</i>需要引用[组件的prop](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931)。

<!-- The creator of Redux Dan Abramov has created a wonderful tutorial called [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) that you can find on Egghead.io. I highly recommend the tutorial to everyone. The last four videos discuss the *connect* method, particularly the more "complicated" way of using it.-->
 Redux的创造者Dan Abramov创造了一个精彩的教程，叫做[Redux入门](https://egghead.io/courses/getting-started-with-redux)，你可以在Egghead.io上找到。我向大家强烈推荐这个教程。最后四个视频讨论了*connect*方法，特别是使用它的更 "复杂 "的方式。

### Presentational/Container revisited

<!-- The refactored <i>Notes</i> component is almost entirely focused on rendering notes and is quite close to being a so-called [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). According to the [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) provided by Dan Abramov, presentation components:-->
 重构后的<i>Notes</i>组件几乎完全专注于渲染笔记，而且相当接近于所谓的[展示性组件](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)。根据Dan Abramov提供的[描述](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)，演示组件。

<!-- - Are concerned with how things look.-->
 - 关注事物的外观。
<!-- - May contain both presentational and container components inside, and usually have some DOM markup and styles of their own.-->
 - 里面可能同时包含展示组件和容器组件，并且通常有一些DOM标记和它们自己的样式。
<!-- - Often allow containment via props.children.-->
 - 通常允许通过props.children进行包含。
<!-- - Have no dependencies on the rest of the app, such as Redux actions or stores.-->
 - 对应用的其他部分没有依赖性，例如Redux动作或商店。
<!-- - Don’t specify how the data is loaded or mutated.-->
 - 不指定数据是如何被加载或改变的。
<!-- - Receive data and callbacks exclusively via props.-->
 - 完全通过props接收数据和回调。
<!-- - Rarely have their own state (when they do, it’s UI state rather than data).-->
 - 很少有自己的状态（如果有，也是UI状态而不是数据）。
<!-- - Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.-->
 - 除非它们需要状态、生命周期钩子或性能优化，否则就被写成功能组件。

<!-- The _connected component_ that is created with the *connect* function:-->
 用*connect*函数创建的_connected组件_。

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
 符合<i>container</i>组件的描述。根据Dan Abramov提供的[描述](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)，容器组件。

<!-- - Are concerned with how things work.-->
 - 关注事物的工作方式。
<!-- - May contain both presentational and container components inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.-->
 - 里面可能同时包含展示性组件和容器组件，但除了一些包裹性的div，通常没有任何自己的DOM标记，也没有任何样式。
<!-- - Provide the data and behavior to presentational or other container components.-->
 - 为展示性或其他容器组件提供数据和行为。
<!-- - Call Redux actions and provide these as callbacks to the presentational components.-->
 - 调用Redux动作，并将其作为回调提供给渲染组件。
<!-- - Are often stateful, as they tend to serve as data sources.-->
 - 通常是有状态的，因为它们往往作为数据源。
<!-- - Are usually generated using higher order components such as connect from React Redux, rather than written by hand.-->
 - 通常使用高阶组件生成，如来自React Redux的connect，而不是手工编写。

<!-- Dividing the application into presentational and container components is one way of structuring React applications that has been deemed beneficial. The division may be a good design choice or it may not, it depends on the context.-->
 将应用分为展示性组件和容器组件是一种被认为是有益的React应用结构的方式。这种划分可能是一个好的设计选择，也可能不是，这取决于环境。

<!-- Abramov attributes the following [benefits](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) to the division:-->
 Abramov将以下[好处](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)归于这种划分。

<!-- - Better separation of concerns. You understand your app and your UI better by writing components this way.-->
 - 更好地分离关注点。通过这样写组件，你可以更好地理解你的应用和你的用户界面。
<!-- - Better reusability. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused.-->
 - 更好的重用性。你可以在完全不同的状态源中使用相同的表现型组件，并将这些组件变成可以进一步重用的独立容器组件。
<!-- - Presentational components are essentially your app’s “palette”. You can put them on a single page and let the designer tweak all their variations without touching the app’s logic. You can run screenshot regression tests on that page.-->
 - 渲染式组件本质上是你的应用的 "调色板"。你可以把它们放在一个页面上，让设计者调整它们的所有变化，而不触及应用的逻辑。你可以在该页面上运行屏幕截图回归测试。

<!-- Abramov mentions the term [high order component](https://reactjs.org/docs/higher-order-components.html). The <i>Notes</i> component is an example of a regular component, whereas the <i>connect</i> method provided by React-Redux is an example of a <i>high order component</i>. Essentially, a high order component is a function that accept a "regular" component as its parameter, that then returns a new "regular" component as its return value.-->
阿布拉莫夫提到了术语[高阶组件](https://reactjs.org/docs/higher-order-components.html)。<i>Notes</i>组件是一个普通组件的例子，而React-Redux提供的<i>connect</i>方法是一个<i>高阶组件</i>的例子。从本质上讲，高阶组件是一个接受 "常规 "组件作为其参数的函数，然后返回一个新的 "常规 "组件作为其返回值。

<!-- High order components, or HOCs, are a way of defining generic functionality that can be applied to components. This is a concept from functional programming that very slightly resembles inheritance in object oriented programming.-->
高阶组件，或称HOC，是一种定义可以应用于组件的通用功能的方式。这是一个来自函数式编程的概念，与面向对象编程中的继承非常相似。

<!-- HOCs are a generalization of the [High Order Function](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) concept. HOFs are functions that either accept functions as parameters or return functions. We have actually been using HOFs throughout the course, e.g. all of the methods used for dealing with arrays like *map, filter and find* are HOFs.-->
 HOCs实际上是[高阶函数](https://en.wikipedia.org/wiki/Higher-order_function) (HOF)概念的概括。HOFs是接受函数作为参数或返回函数的函数。实际上，我们在整个课程中一直在使用HOF，例如，所有用于处理数组的方法，如*map、filter和find*都是HOF。

<!-- Reactin hook-apin ilmestymisen jälkeen HOC:ien suosio on kääntynyt laskuun, ja melkein kaikki kirjastot, joiden käyttö on aiemmin perustunut HOC:eihin on saanut hook-perustaisen apin. Useimmiten , kuten myös reduxin kohdalla, hook-perustaiset apit ovat HOC-apeja huomattavasti yksinkertaisempia. -->
<!-- After the React hook-api was published, HOCs have become less and less popular. Almost all libraries which used to be based on HOCs have now been modified to use hooks. Most of the time hook based apis are a lot simpler than HOC based ones, as is the case with redux as well.-->
 在React hook-api发布后，HOCs变得越来越不流行了。几乎所有曾经基于HOCs的库现在都被修改为使用钩子。大多数时候，基于钩子的api比基于HOC的api要简单得多，redux也是如此。

### Redux and the component state

<!-- We have come a long way in this course and, finally, we have come to the point at which we are using React "the right way", meaning React only focuses on generating the views, and the application state is separated completely from the React components and passed on to Redux, its actions, and its reducers.-->
 在这个课程中，我们已经走了很长的路，最后，我们已经走到了 "正确的方式 "使用React的地步，这意味着React只专注于生成视图，应用状态完全与React组件分离，并传递给Redux、其动作和其还原器。

<!-- What about the *useState*-hook, which provides components with their own state? Does it have any role if an application is using Redux or some other external state management solution? If the application has more complicated forms, it may be beneficial to implement their local state using the state provided by the *useState* function. One can, of course, have Redux manage the state of the forms, however, if the state of the form is only relevant when filling the form (e.g. for validation) it may be wise to leave the management of state to the component responsible for the form.-->
 那么*useState*-hook呢，它为组件提供了它们自己的状态？如果一个应用使用Redux或其他外部状态管理解决方案，它是否有任何作用？如果应用有更复杂的表单，使用*useState*函数提供的状态来实现它们的本地状态可能是有益的。当然，人们可以让Redux管理表单的状态，然而，如果表单的状态只在填写表单时才相关（例如用于验证），那么将状态的管理留给负责表单的组件可能是明智的。

<!-- Should we always use redux? Probably not. Dan Abramov, the developer of redux, discusses this in his article [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367).-->
 我们应该总是使用redux吗？也许不是。redux的开发者Dan Abramov在他的文章[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)中讨论了这个问题。

<!-- Nowadays it is possible to implement redux-like state management without redux by using the React [context](https://reactjs.org/docs/context.html)-api and the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)-hook.-->
 现在可以通过使用React [context](https://reactjs.org/docs/context.html)-api和[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)-hook来实现类似redux的状态管理，而无需redux。
<!-- More about this [here](https://www.simplethread.com/cant-replace-redux-with-hooks/) and [here](https://hswolff.com/blog/how-to-usecontext-with-usereducer/). We will also practice this in-->
 关于这个的更多信息[这里](https://www.simplethread.com/cant-replace-redux-with-hooks/)和[这里](https://hswolff.com/blog/how-to-usecontext-with-usereducer/)。我们还将在以下方面进行实践
<!-- [part 9](/en/part9).-->
 [第9章节](/en/part9)。

</div>

<div class="tasks">

### Exercises 6.19.-6.21
<!--**NOTE**: this is the old ending section of the 6 part that has 30th January 2023 been replaced with material about [React Query, useReducer and context](/en/part6/react_query_use_reducer_and_the_contex). This section remains here for a couple of weeks.-->

**注意**: 本章作为旧版第 6 部分的结束章节，已经在2023年1月30日被替换为“ [React Query, useReducer 和 context](/zh/part6/react_query_use_reducer_and_the_contex)“。这一章将仅在此保留几周。

<!--If you have started with the exercises (6.19-6.21) that use the Redux connect you may continue with those. If you have not yet started, I recommend to proceed with the new section.-->

如果你已经用 Redux 的 connect 方法开始了 6.19 - 6.21 的练习，你可以继续将它完成。但如果你还没有开始，我建议你从更新后的新章节开始。

#### 6.19 anecdotes and connect, step1

<!-- The <i>redux store</i> is currently being accessed by the components through the <em>useSelector</em> and <em>useDispatch</em> hooks.-->
 <i>redux存储</i>目前被组件通过<em>useSelector</em>和<em>useDispatch</em>挂钩访问。

<!-- Modify the <i>Notification</i> component so that it uses the *connect* function instead of the hooks.-->
 修改<i>Notification</i>组件，使其使用*connect*函数而不是钩子。

#### 6.20 anecdotes and connect, step2

<!-- Do the same for the <i>Filter</i> and <i>AnecdoteForm</i> components.-->
 对<i>Filter</i>和<i>AnecdoteForm</i>组件进行同样的修改。
#### 6.21 anecdotes, the grand finale

<!-- You (probably) have one nasty bug in your application. If the user clicks the vote button multiple times in a row, the notification is displayed funnily. For example if a user votes twice in three seconds,-->
 你的应用中（可能）有一个讨厌的错误。如果用户连续多次点击投票按钮，通知就会有趣地显示出来。例如，如果一个用户在三秒钟内投票两次。
<!-- the last notification is only displayed for two seconds (assuming the notification is normally shown for 5 seconds). This happens because removing the first notification accidentally removes the second notification.-->
最后一个通知只显示两秒（假设通知通常显示5秒）。出现这种情况是因为删除第一条通知时，意外地删除了第二条通知。

<!-- Fix the bug so that after multiple votes in a row, the notification for the last vote is displayed for five seconds.-->
 修复这个错误，使连续多次投票后，最后一次投票的通知显示5秒。
<!-- This can be done by cancelling the removal of the previous notification when a new notification is displayed whenever necessary.-->
 这可以通过在必要时显示新的通知时取消对前一个通知的删除来实现。
<!-- The [documentation](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) for the setTimeout function might also be useful for this.-->
 setTimeout函数的[文档](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)也可能对此有用。

<!-- This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your completed exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
 这是这部分课程的最后一个练习，是时候把你的代码推送到GitHub，并把你所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。

</div>
