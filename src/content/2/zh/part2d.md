---
mainImage: ../../../images/part-2.svg
part: 2
letter: d
lang: zh
---

<div class="content">

<!-- When creating notes in our application, we would naturally want to store them in some backend server. The [json-server](https://github.com/typicode/json-server) package claims to be a so-called REST or RESTful API in its documentation:-->
当在我们的应用中创建笔记时，我们自然希望将它们存储在某个后端服务端中。[json-server](https://github.com/typicode/json-server)包在文档中自称是一个所谓的REST或RESTful API：

<!-- > <i>Get a full fake REST API with zero coding in less than 30 seconds (seriously)</i>-->
> <i>30秒内零编码（认真的）获得一个完整的假REST API</i>

<!-- The json-server does not exactly match the description provided by the textbook [definition](https://en.wikipedia.org/wiki/Representational_state_transfer) of a REST API, but neither do most other APIs claiming to be RESTful.-->
json-server并不完全符合教科书对REST API的描述[定义](https://en.wikipedia.org/wiki/Representational_state_transfer)，但其他大多数自称是RESTful的API也不符合。

<!-- We will take a closer look at REST in the [next part](/en/part3) of the course. But it's important to familiarize ourselves at this point with some of the [conventions](https://en.wikipedia.org/wiki/REST#Applied_to_web_services) used by json-server and REST APIs in general. In particular, we will be taking a look at the conventional use of [routes](https://github.com/typicode/json-server#routes), aka URLs and HTTP request types, in REST. -->
我们将在课程的[下一章节](/zh/part3)中仔细研究REST。但是现在的重点是熟悉json-server和各种REST API通用的一些[约定](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services)。特别是REST中[路由](https://github.com/typicode/json-server#routes)，也就是URL和HTTP请求类型的常规使用方法。

### REST

<!-- In REST terminology, we refer to individual data objects, such as the notes in our application, as <i>resources</i>. Every resource has a unique address associated with it - its URL. According to a general convention used by json-server, we would be able to locate an individual note at the resource URL <i>notes/3</i>, where 3 is the id of the resource. The <i>notes</i> URL, on the other hand, would point to a resource collection containing all the notes. -->
在REST术语中，我们把单个数据对象，比如我们应用中的笔记，称为<i>资源</i>。每个资源都有一个与之相关的独一无二的地址——它的URL。根据json-server使用的一般惯例，我们可以通过资源URL <i>notes/3</i>来定位某一条笔记，其中3是资源的id。另一方面，<i>notes</i> URL将指向一个包含所有笔记的资源集合。

<!-- Resources are fetched from the server with HTTP GET requests. For instance, an HTTP GET request to the URL <i>notes/3</i> will return the note that has the id number 3. An HTTP GET request to the <i>notes</i> URL would return a list of all notes.-->
资源是通过HTTP GET请求从服务端获取的。例如，对URL <i>notes/3</i>的HTTP GET请求将返回ID为3的笔记。对<i>notes</i> URL的HTTP GET请求将返回所有笔记的列表。

<!-- Creating a new resource for storing a note is done by making an HTTP POST request to the <i>notes</i> URL according to the REST convention that the json-server adheres to. The data for the new note resource is sent in the <i>body</i> of the request.-->
根据json-server所遵守的REST惯例，创建用于存储笔记的新资源是通过向<i>notes</i> URL发送HTTP POST请求来实现的。新笔记资源的数据在请求<i>体</i>中发送。

<!-- json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string, and that the request must contain the <i>Content-Type</i> request header with the value <i>application/json</i>.-->
json-server要求所有数据以JSON格式发送。这实际上意味着数据必须是格式正确的字符串，而且请求必须包含<i>Content-Type</i>标头，且<i>Content-Type</i>的值为<i>application/json</i>。

<!-- ### Sending Data to the Server -->
### 向服务端发送数据

<!-- Let's make the following changes to the event handler responsible for creating a new note:-->
让我们对负责创建新笔记的事件处理函数做如下修改：

```js
const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
  }

// highlight-start
  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
// highlight-end
}
```

<!-- We create a new object for the note but omit the <i>id</i> property since it's better to let the server generate ids for our resources. -->
我们为笔记创建一个新的对象，但省略了<i>id</i>属性，因为id最好让服务端为我们的资源生成。

<!-- The object is sent to the server using the axios <em>post</em> method. The registered event handler logs the response that is sent back from the server to the console.-->
使用axios的<em>post</em>方法将对象发送到服务端。注册的事件处理函数记录了从服务端发回控制台的响应。

<!-- When we try to create a new note, the following output pops up in the console:-->
当我们尝试创建一条新的笔记时，控制台中会弹出以下输出：

![](../../images/2/20e.png)

<!-- The newly created note resource is stored in the value of the <i>data</i> property of the _response_ object.-->
新创建的笔记资源被存储在_response_对象的<i>data</i>属性值中。

<!-- Quite often it is useful to inspect HTTP requests in the <i>Network</i> tab of Chrome developer tools, which was used heavily at the beginning of [part 0](/en/part0/fundamentals_of_web_apps#http-get). -->
在Chrome开发工具中的<i>Network</i>标签页中检查HTTP请求经常会很有用，[第0章节](/zh/part0/web_应用的基础设施#http-get)的开头就大量使用了这个标签页。

<!-- We can use the inspector to check that the headers sent in the POST request are what we expected them to be: -->
我们可以使用检查器来检查POST请求中发送的标头是否是我们所期望的：

![](../../images/2/21new1.png)

<!-- Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate <i>application/json</i> value for the <i>Content-Type</i> header.-->
由于我们在POST请求中发送的数据是一个JavaScript对象，axios自动知道为将<i>Content-Type</i>标头设为正确的<i>application/json</i>值。

<!-- The tab <i>payload</i> can be used to check the request data: -->
<i>负载</i>标签页可以用来查看请求的数据：

![](../../images/2/21new2.png)

<!-- Also the tab <i>response</i> is useful, it shows what was the data the server responded with: -->
<i>响应</i>标签页也有用，它展示了服务端响应的数据是什么：

![](../../images/2/21new3.png)

<!-- The new note is not rendered to the screen yet. This is because we did not update the state of the <i>App</i> component when we created it. Let's fix this: -->
新笔记还没有渲染到屏幕上。这是因为我们在创建新笔记时没有更新<i>App</i>组件的状态。让我们来解决这个问题：

```js
const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      // highlight-start
      setNotes(notes.concat(response.data))
      setNewNote('')
      // highlight-end
    })
}
```

<!-- The new note returned by the backend server is added to the list of notes in our application's state in the customary way of using the <em>setNotes</em> function and then resetting the note creation form. An [important detail](/en/part1/a_more_complex_state_debugging_react_apps#handling-arrays) to remember is that the <em>concat</em> method does not change the component's original state, but instead creates a new copy of the list.-->
通过惯常的方式，将后端服务端返回的新笔记添加到我们应用状态中的笔记列表中，使用<em>setNotes</em>函数，然后重置创建笔记的表单。一个需要记住的[重要细节](/zh/part1/复杂状态，调试_react应用#处理数组)是，<em>concat</em>方法并不改变组件的状态本体，而是创建一个新的列表副本。

<!-- Once the data returned by the server starts to have an effect on the behavior of our web applications, we are immediately faced with a whole new set of challenges arising from, for instance, the asynchronicity of communication. This necessitates new debugging strategies, console logging and other means of debugging become increasingly more important. We must also develop a sufficient understanding of the principles of both the JavaScript runtime and React components. Guessing won't be enough.-->
一旦服务端返回的数据开始影响我们Web应用的行为，我们就会立即面临一系列全新的挑战，例如，通信的异步性。这就需要新的调试策略，控制台记录和其他调试方法变得越来越重要。我们还必须对JavaScript运行时和React组件的原理有足够的理解。仅仅通过猜是不够的。

<!-- It's beneficial to inspect the state of the backend server, e.g. through the browser:-->
检查后端服务端的状态是有好处的，比如通过浏览器：

![](../../images/2/22e.png)

<!-- This makes it possible to verify that all the data we intended to send was actually received by the server.-->
这让我们可以验证我们打算发送的所有数据是否真的被服务端收到。

<!-- In the next part of the course we will learn to implement our own logic in the backend. We will then take a closer look at tools like [Postman](https://www.postman.com/downloads/) that helps us to debug our server applications. However, inspecting the state of the json-server through the browser is sufficient for our current needs.-->
在课程的下一部分，我们将学习如何在后端实现我们自己的逻辑。然后我们将仔细研究像[Postman](https://www.postman.com/downloads/)这些可以帮助我们调试我们的服务端应用的工具。不过目前而言，通过浏览器检查json-server的状态就足够满足我们的需要了。

<!-- The code for the current state of our application can be found in the  <i>part2-5</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-5). -->
我们应用当前状态的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-5)上的<i>part2-5</i>分支找到。

<!-- ### Changing the Importance of Notes -->
### 改变笔记的重要性

<!-- Let's add a button to every note that can be used for toggling its importance.-->
让我们为每条笔记添加一个可以用来切换笔记的重要性的按钮。

<!-- We make the following changes to the <i>Note</i> component:-->
我们对<i>Note</i>组件做如下修改：

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

<!-- We add a button to the component and assign its event handler as the <em>toggleImportance</em> function passed in the component's props.-->
我们给组件添加一个按钮，并将其事件处理函数赋值为组件的props中传递的<em>toggleImportance</em>函数。

<!-- The <i>App</i> component defines an initial version of the <em>toggleImportanceOf</em> event handler function and passes it to every <i>Note</i> component:-->
<i>App</i>组件定义了一个初始版本的<em>toggleImportanceOf</em>事件处理函数，并将其传递给每个<i>Note</i>组件：

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  // highlight-start
  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
  }
  // highlight-end

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} // highlight-line
          />
        )}
      </ul>
      // ...
    </div>
  )
}
```

<!-- Notice how every note receives its own <i>unique</i> event handler function, since the <i>id</i> of every note is unique.-->
注意每条笔记是如何得到它自己<i>独有的</i>事件处理函数的，因为每条笔记的<i>id</i>都是独一无二的。

<!-- E.g., if <i>note.id</i> is 3, the event handler function returned by _toggleImportance(note.id)_ will be:-->
例如，如果<i>note.id</i>是3，由_toggleImportance(note.id)_返回的事件处理函数将是：

```js
() => { console.log('importance of 3 needs to be toggled') }
```

<!-- A short reminder here. The string printed by the event handler is defined in Java-like manner by adding the strings:-->
在此简单提醒一下。事件处理函数所打印的字符串是以类似Java的方式使用加号连接字符串来定义的：

```js
console.log('importance of ' + id + ' needs to be toggled')
```

<!-- The [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax added in ES6 can be used to write similar strings in a much nicer way:-->
可以用ES6中添加的[模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)语法来以更好的方式编写类似的字符串：

```js
console.log(`importance of ${id} needs to be toggled`)
```

<!-- We can now use the "dollar-bracket"-syntax to add parts to the string that will evaluate JavaScript expressions, e.g. the value of a variable. Note that we use backticks in template strings instead of quotation marks used in regular JavaScript strings. -->
我们现在可以使用“${}”语法在字符串中添加要计算JavaScript表达式的部分，例如变量的值。注意，我们在模板字符串中使用的是反引号*\`*，而非用于普通JavaScript字符串的引号*'*或*"*。

<!-- Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL. We can either <i>replace</i> the entire note with an HTTP PUT request, or only change some of the note's properties with an HTTP PATCH request.-->
存储在json-server后端的每条笔记可以通过两种不同方式进行修改，两种方式都是对笔记的唯一URL进行HTTP请求。我们可以用HTTP PUT请求来<i>替换</i>整条笔记，也可以用HTTP PATCH请求只改变笔记的某些属性。

<!-- The final form of the event handler function is the following:-->
事件处理函数的最终形式是这样的：

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id === id ? response.data : note))
  })
}
```

<!-- Almost every line of code in the function body contains important details. The first line defines the unique URL for each note resource based on its id. -->
函数体中的几乎每一行代码都包含了重要的细节。第一行定义了基于笔记id的每条笔记资源的唯一URL。

<!-- The array [find method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) is used to find the note we want to modify, and we then assign it to the _note_ variable.-->
数组的[find方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)用来查找我们要修改的笔记，然后我们把要修改的笔记赋值给_note_变量。

<!-- After this, we create a <i>new object</i> that is an exact copy of the old note, apart from the important property that has the value flipped (from true to false or from false to true). -->
在这之后，我们创建一个<i>新对象</i>，它是旧笔记的精确拷贝，除了important属性的值被翻转（从true变为false或从false变为true）。

<!-- The code for creating the new object that uses the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax may seem a bit strange at first:-->
创建新对象的代码使用了[对象展开](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)语法，一开始可能看起来有点奇怪：

```js
const changedNote = { ...note, important: !note.important }
```

<!-- In practice, <em>{ ...note }</em> creates a new object with copies of all the properties from the _note_ object. When we add properties inside the curly braces after the spread object, e.g. <em>{ ...note, important: true }</em>, then the value of the _important_ property of the new object will be _true_. In our example, the <em>important</em> property gets the negation of its previous value in the original object. -->
实际上，<em>{ ...note }</em>创建了一个复制了_note_对象所有属性的新对象。当我们在展开对象后面的大括号内添加属性时，比如<em>{ ...note, important: true }</em>，那么新对象的_important_属性值将是_true_。在我们的例子中，<em>important</em>属性是原来对象中先前important值的相反值。

<!-- There's a few things to point out. Why did we make a copy of the note object we wanted to modify, when the following code also appears to work?-->
有几件事需要指出。为什么我们要创建一个我们要修改的笔记对象的拷贝，明明下面的代码看起来也能运行？

```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
```

<!-- This is not recommended because the variable <em>note</em> is a reference to an item in the <em>notes</em> array in the component's state, and as we recall we must [never mutate state directly](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react) in React. -->
不建议这样做，因为变量<em>note</em>是对组件状态中<em>notes</em>数组中一项的引用，而我们记得我们在React中[决不能直接改变状态](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react)。

<!-- It's also worth noting that the new object _changedNote_ is only a so-called [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy), meaning that the values of the new object are the same as the values of the old object. If the values of the old object were objects themselves, then the copied values in the new object would reference the same objects that were in the old object.-->
还有一点值得注意，新对象_changedNote_只是一个所谓的[浅拷贝](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy)，意味着新对象中各属性的值与旧对象中各属性的值相同。如果旧对象中某属性的值也是对象，那么新对象中该属性的复制值将和旧对象中的该属性的原始值引用相同的对象。

<!-- The new note is then sent with a PUT request to the backend where it will replace the old object.-->
然后，新的笔记会通过PUT请求发送到后端，在那里它将替换旧的对象。

<!-- The callback function sets the component's <em>notes</em> state to a new array that contains all the items from the previous <em>notes</em> array, except for the old note which is replaced by the updated version of it returned by the server:-->
回调函数将组件的<em>notes</em>状态设为一个新的数组，该数组包含了原先<em>notes</em>数组中的所有项，除了旧的笔记被替换为服务端返回的更新版本：

```js
axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id === id ? response.data : note))
})
```

<!-- This is accomplished with the <em>map</em> method:-->
这是用<em>map</em>方法完成的：

```js
notes.map(note => note.id === id ? response.data : note)
```

<!-- The map method creates a new array by mapping every item from the old array into an item in the new array. In our example, the new array is created conditionally so that if <em>note.id === id</em> is true; the note object returned by the server is added to the array. If the condition is false, then we simply copy the item from the old array into the new array instead. -->
map方法会通过将旧数组中的每一项映射到新数组的每一项来创建一个新数组。在我们的例子中，新数组是通过条件创建的，如果<em>note.id === id</em>为true，那么就会把服务端返回的笔记对象添加到数组中。如果条件为false，那么我们就只是简单把旧数组的项复制到新数组中。

<!-- This <em>map</em> trick may seem a bit strange at first, but it's worth spending some time wrapping your head around it. We will be using this method many times throughout the course.-->
这个<em>map</em>技巧一开始可能看起来有点奇怪，但值得花些时间去琢磨它。我们将在整个课程中多次使用这种方法。

<!-- ### Extracting Communication with the Backend into a Separate Module -->
### 把和后端的通信提取到单独的模块中

<!-- The <i>App</i> component has become somewhat bloated after adding the code for communicating with the backend server. In the spirit of the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), we deem it wise to extract this communication into its own [module](/en/part2/rendering_a_collection_modules#refactoring-modules).-->
在添加了与后端服务端通信的代码后，<i>App</i>组件变得有些臃肿。本着[单一职责原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)，我们认为将与后端服务端的通信提取到自己的[模块](/zh/part2/渲染集合与模块#重构模块)是明智的。

<!-- Let's create a <i>src/services</i> directory and add a file there called <i>notes.js</i>:-->
让我们创建一个<i>src/services</i>目录，并向其中添加一个名为<i>notes.js</i>的文件：

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default {
  getAll: getAll,
  create: create,
  update: update
}
```

<!-- The module returns an object that has three functions (<i>getAll</i>, <i>create</i>, and <i>update</i>) as its properties that deal with notes. The functions directly return the promises returned by the axios methods.-->
该模块返回一个对象，该对象有三个处理笔记的函数（<i>getAll</i>、<i>create</i>和<i>update</i>）作为其属性。这些函数直接返回axios方法所返回的Promise。

<!-- The <i>App</i> component uses <em>import</em> to get access to the module:-->
<i>App</i>组件使用<em>import</em>来访问模块：

```js
import noteService from './services/notes' // highlight-line

const App = () => {
```

<!-- The functions of the module can be used directly with the imported variable _noteService_ as follows:-->
可以直接通过导入的变量_noteService_使用该模块的函数，如下所示：

```js
const App = () => {
  // ...

  useEffect(() => {
    // highlight-start
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
    // highlight-end
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // highlight-start
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id === id ? response.data : note))
      })
    // highlight-end
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

// highlight-start
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
// highlight-end
  }

  // ...
}

export default App
```

<!-- We could take our implementation a step further. When the <i>App</i> component uses the functions, it receives an object that contains the entire response for the HTTP request:-->
我们可以深入看一下我们的实现。当<i>App</i>组件调用这些函数时，它会收到一个包含HTTP请求全部响应的对象：

```js
noteService
  .getAll()
  .then(response => {
    setNotes(response.data)
  })
```

<!-- The <i>App</i> component only uses the <i>response.data</i> property of the response object.-->
<i>App</i>组件只使用响应对象的<i>response.data</i>属性。

<!-- The module would be much nicer to use if, instead of the entire HTTP response, we would only get the response data. Using the module would then look like this:-->
如果只获得响应数据，而非整个HTTP响应，那么这个模块的就会明显更好用。于是使用这个模块就会像这样：

```js
noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })
```

<!-- We can achieve this by changing the code in the module as follows (the current code contains some copy-paste, but we will tolerate that for now):-->
要实现这个需求，我们可以将模块的代码改成这样（目前的代码包含一些复制粘贴的内容，但我们现在暂且不管）：

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default {
  getAll: getAll,
  create: create,
  update: update
}
```


<!-- We no longer return the promise returned by axios directly. Instead, we assign the promise to the <em>request</em> variable and call its <em>then</em> method:-->
我们不再直接返回axios返回的Promise。而是将Promise赋值给<em>request</em>变量并调用其<em>then</em>方法：

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```

<!-- The last row in our function is simply a more compact expression of the same code as shown below:-->
我们函数中的最后一行只是对下面相同代码的一个更紧凑的表达：

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  // highlight-start
  return request.then(response => {
    return response.data
  })
  // highlight-end
}
```

<!-- The modified <em>getAll</em> function still returns a promise, as the <em>then</em> method of a promise also [returns a promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).-->
修改后的<em>getAll</em>函数仍然返回一个Promise，因为Promise的<em>then</em>方法也[返回一个Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)。

<!-- After defining the parameter of the <em>then</em> method to directly return <i>response.data</i>, we have gotten the <em>getAll</em> function to work like we wanted it to. When the HTTP request is successful, the promise returns the data sent back in the response from the backend.-->
在定义<em>then</em>方法的参数来让<em>getAll</em>函数直接返回<i>response.data</i>之后，<em>getAll</em>已经函数满足了我们的需求。当HTTP请求成功时，Promise会返回后端响应发回的数据。

<!-- We have to update the <i>App</i> component to work with the changes made to our module.  We have to fix the callback functions given as parameters to the <em>noteService</em> object's methods, so that they use the directly returned response data:-->
我们必须更新<i>App</i>组件以配合我们对模块的更改。我们必须更改传给<em>noteService</em>对象方法的参数的回调函数，让它们直接使用返回的响应数据：

```js
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      // highlight-start
      .then(initialNotes => {
        setNotes(initialNotes)
      // highlight-end
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      // highlight-start
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      // highlight-end
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      // highlight-start
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      // highlight-end
        setNewNote('')
      })
  }

  // ...
}
```

<!-- This is all quite complicated and attempting to explain it may just make it harder to understand. The internet is full of material discussing the topic, such as [this](https://javascript.info/promise-chaining) one.-->
这一切都很复杂，试图解释它可能只会让它更难理解。互联网上有很多讨论这个话题的资料，比如[这](https://javascript.info/promise-chaining)个。

<!-- The "Async and performance" book from the [You do not know JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) book series [explains the topic](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md) well, but the explanation is many pages long.-->
[You do not know JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed)丛书中的《Async and performance》一书很好地[解释了这个话题](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md)，但解释的篇幅很长。

<!-- Promises are central to modern JavaScript development and it is highly recommended to invest a reasonable amount of time into understanding them.-->
Promise是现代JavaScript开发的核心，强烈建议投入一定时间来理解它们。

<!-- ### Cleaner Syntax for Defining Object Literals -->
### 更清晰地定义对象字面量的语法

<!-- The module defining note related services currently exports an object with the properties <i>getAll</i>, <i>create</i>, and <i>update</i> that are assigned to functions for handling notes.-->
定义笔记相关服务的模块目前导出了一个对象，其属性<i>getAll</i>、<i>create</i>和<i>update</i>被赋值了处理笔记的函数。

<!-- The module definition was:-->
模块的定义是：

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default {
  getAll: getAll,
  create: create,
  update: update
}
```

<!-- The module exports the following, rather peculiar looking, object:-->
该模块导出了下面看起来相当奇怪的对象：

```js
{
  getAll: getAll,
  create: create,
  update: update
}
```

<!-- The labels to the left of the colon in the object definition are the <i>keys</i> of the object, whereas the ones to the right of it are <i>variables</i> that are defined inside of the module.-->
对象定义中，冒号左边的标签是对象的<i>键</i>，而冒号右边的是模块中定义的<i>变量</i>。

<!-- Since the names of the keys and the assigned variables are the same, we can write the object definition with a more compact syntax:-->
由于键名和赋值的变量名是一样的，我们可以使用更紧凑的语法来定义对象：

```js
{
  getAll,
  create,
  update
}
```

<!-- As a result, the module definition gets simplified into the following form:-->
于是，模块的定义被简化为：

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update } // highlight-line
```

<!-- In defining the object using this shorter notation, we make use of a [new feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions) that was introduced to JavaScript through ES6, enabling a slightly more compact way of defining objects using variables.-->
在使用这种更简洁的符号定义对象时，我们利用了在ES6中引入到JavaScript中的[新特性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions)，它让使用变量定义对象的方式稍微更紧凑了一些。

<!-- To demonstrate this feature, let's consider a situation where we have the following values assigned to variables:-->
为了演示这个特性，让我们考虑这种情况，我们给变量赋了以下的值：

```js
const name = 'Leevi'
const age = 0
```

<!-- In older versions of JavaScript we had to define an object like this:-->
在旧版本的JavaScript中，我们必须这样定义一个对象：

```js
const person = {
  name: name,
  age: age
}
```

<!-- However, since both the property fields and the variable names in the object are the same, it's enough to simply write the following in ES6 JavaScript:-->
然而，由于对象中的属性字段名和变量名都是一样的，所以在ES6 JavaScript中，只需这么写就够了：

```js
const person = { name, age }
```

<!-- The result is identical for both expressions. They both create an object with a <i>name</i> property with the value <i>Leevi</i> and an <i>age</i> property with the value <i>0</i>.-->
两个表达式的结果都是一样的。它们都创建了一个对象，其<i>name</i>属性值为<i>Leevi</i>，<i>age</i>属性值为<i>0</i>。

<!-- ### Promises and Errors -->
### Promise和错误

<!-- If our application allowed users to delete notes, we could end up in a situation where a user tries to change the importance of a note that has already been deleted from the system.-->
如果我们的应用允许用户删除笔记，我们可能会出现这种情况：用户试图改变一条笔记的重要性，而这条笔记在系统中已经被删除了。

<!-- Let's simulate this situation by making the <em>getAll</em> function of the note service return a "hardcoded" note that does not actually exist on the backend server:-->
让我们模拟这种情况，让笔记服务的<em>getAll</em>函数返回一条“硬编码”的笔记，而这条笔记实际上并不存在于后端服务端上。

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}
```

<!-- When we try to change the importance of the hardcoded note, we see the following error message in the console. The error says that the backend server responded to our HTTP PUT request with a status code 404 <i>not found</i>.-->
当我们试图改变这条硬编码笔记的重要性时，我们在控制台中看到了以下错误信息。该错误说后端服务端对我们的HTTP PUT请求的响应是状态代码404 <i>not found</i>。

![](../../images/2/23e.png)

<!-- The application should be able to handle these types of error situations gracefully. Users won't be able to tell that an error has occurred unless they happen to have their console open. The only way the error can be seen in the application is that clicking the button does not affect the note's importance. -->
应用应当能优雅地处理这些类型的错误情况。用户无法得知发生了错误，除非他们碰巧打开了他们的控制台。在应用中可以看到错误的唯一方法是，点击按钮没有影响笔记的重要性。

<!-- We had [previously](/en/part2/getting_data_from_server#axios-and-promises) mentioned that a promise can be in one of three different states. When an axios HTTP request fails, the associated promise is <i>rejected</i>. Our current code does not handle this rejection in any way. -->
我们[之前](/zh/part2/获取服务端的数据#axios和-promise)提到，一个Promise可能有三种不同的状态。当一个axios HTTP请求失败时，相关的Promise<i>被拒绝</i>。我们目前的代码没有以任何方式处理被拒绝的情况。

<!-- The rejection of a promise is [handled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) by providing the <em>then</em> method with a second callback function, which is called in the situation where the promise is rejected.-->
Promise被拒绝的情况是由为<em>then</em>方法提供的第二个回调函数来[处理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)的，第二个回调函数在Promise被拒绝的情况下被调用。

<!-- The more common way of adding a handler for rejected promises is to use the [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method.-->
为被拒绝的Promise添加处理函数的更常见的方式是使用[catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)方法。

<!-- In practice, the error handler for rejected promises is defined like this:-->
在实践中，被拒绝的Promise的错误处理函数是像这样定义的：

```js
axios
  .get('http://example.com/probably_will_fail')
  .then(response => {
    console.log('success!')
  })
  .catch(error => {
    console.log('fail')
  })
```

<!-- If the request fails, the event handler registered with the <em>catch</em> method gets called.-->
如果请求失败，<em>catch</em>方法注册的事件处理函数就会被调用。

<!-- The <em>catch</em> method is often utilized by placing it deeper within the promise chain.-->
<em>catch</em>方法经常用于放在Promise链中的更深处。

<!-- When multiple _.then_ methods are chained together, we are in fact creating a [promise chain](https://javascript.info/promise-chaining): -->
当将多个_.then_方法链接在一起时，我们实际上是在创建一个[Promise链](https://javascript.info/promise-chaining)：

```js
axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })
```

<!-- The <em>catch</em> method can be used to define a handler function at the end of a promise chain, which is called once any promise in the chain throws an error and the promise becomes <i>rejected</i>.-->
<em>catch</em>方法可以用来在Promise链的最后定义一个处理函数，一旦Promise链中的任何一个Promise抛出错误，整个Promise<i>被拒绝</i>时，就会调用_catch_方法。

```js
axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })
  .catch(error => {
    console.log('fail')
  })
```

<!-- Let's take advantage of this feature. We will place our application's error handler in the <i>App</i> component: -->
让我们利用这个功能。我们将把我们应用的错误处理函数放在<i>App</i>组件中：

```js
const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
    // highlight-start
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
    // highlight-end
}
```

<!-- The error message is displayed to the user with the trusty old [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) dialog popup, and the deleted note gets filtered out from the state.-->
错误信息会通过久经考验的[alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)对话框弹窗显示给用户，并且删除的笔记会从状态中筛除。

<!-- Removing an already deleted note from the application's state is done with the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method, which returns a new array comprising only the items from the list for which the function that was passed as a parameter returns true for: -->
从应用的状态中删除一条已经删除的笔记是通过数组的[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)方法完成的，它返回一个新数组，该数组只包括列表中，作为参数传递的函数返回true的项：

```js
notes.filter(n => n.id !== id)
```

<!-- It's probably not a good idea to use alert in more serious React applications. We will soon learn a more advanced way of displaying messages and notifications to users. There are situations, however, where a simple, battle-tested method like <em>alert</em> can function as a starting point. A more advanced method could always be added in later, given that there's time and energy for it.-->
在更严肃的React应用中，使用alert很可能不是一个好主意。我们很快就会学到一种向用户显示消息和通知的更高级的方法。然而在有些情况下，像<em>alert</em>这样简单的、经过实践检验的方法可以作为一个起点。在时间和精力允许的情况下，总是可以在以后添加更高级的方法。

<!-- The code for the current state of our application can be found in the  <i>part2-6</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-6). -->
我们应用当前状态的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-6)的<i>part2-6</i>分支中找到。

<!-- ### Full stack developer's oath -->
### 全栈开发者誓言

<!-- It is again time for the exercises. The complexity of our app is now increasing since besides just taking care of the React components in the frontend, we also have a backend that is persisting the application data. -->
又到了练习的时间了。我们应用的复杂性正在增加，因为除了处理前端的React组件之外，我们还有一个后端来持久保存应用的数据。

<!-- To cope with the increasing complexity we should extend the web developer's oath to a <i>Full stack developer's oath</i>, which reminds us to make sure that the communication between frontend and backend happens as expected. -->
为了应对日益增加的复杂性，我们应该将Web开发者誓言扩展为<i>全栈开发者誓言</i>，提醒我们确保前后端之间的通信如预期进行。

<!-- So here is the updated oath: -->
下面是更新后的誓言：

<!-- Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier -->
全栈开发<i>非常难</i>，所以我要尽一切可能方法让它变得更容易

<!-- - I will have my browser developer console open all the time -->
- 我会始终打开浏览器开发者控制台
<!-- - <i>I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect</i> -->
- <i>我会用浏览器开发工具的网络标签页确保前后端的通信如我所预期</i>
<!-- - <i>I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect</i> -->
- <i>我会时刻关注服务端的状态，确保前端发送的数据如我所预期地保存在服务端</i>
<!-- - I will progress with small steps -->
- 我会小步前进
<!-- - I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpoint problems -->
- 我会写大量_console.log_语句来确保我理解代码的行为，并借助其定位问题
<!-- - If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working -->
- 如果我的代码无法运行，我不会写更多的代码。相反，我会开始删除代码，直到它起作用，或者直接回到一切正常的状态
<!-- - When I ask for help in the course Discord channel or elsewhere I formulate my questions properly, see [here](/en/part0/general_info#how-to-get-help-in-discord) how to ask for help -->
- 当我在课程的Discord频道或其他地方寻求帮助时，我会正确地表述我的问题，参见[这里](/en/part0/general_info#how-to-get-help-in-discord)了解如何提问

</div>

<div class="tasks">

<!-- <h3>Exercises 2.12.-2.15.</h3> -->
<h3>练习2.12.~2.15</h3>

<!-- <h4>2.12: The Phonebook step 7</h4> -->
<h4>2.12：电话簿 第7步</h4>

<!-- Let's return to our phonebook application.-->
让我们回到我们的电话簿应用。

<!-- Currently, the numbers that are added to the phonebook are not saved to a backend server. Fix this situation.-->
目前，添加到电话簿的号码没有被保存到后端服务端。修复这一状况。

<!-- <h4>2.13: The Phonebook step 8</h4> -->
<h4>2.13：电话簿 第8步</h4>

<!-- Extract the code that handles the communication with the backend into its own module by following the example shown earlier in this part of the course material.-->
按照本章节教材前面的例子，将处理与后端通信的代码提取到它自己的模块中。

<!-- <h4>2.14: The Phonebook step 9</h4> -->
<h4>2.14：电话簿 第9步</h4>

<!-- Make it possible for users to delete entries from the phonebook. The deletion can be done through a dedicated button for each person in the phonebook list. You can confirm the action from the user by using the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) method:-->
让用户有可以从电话簿中删除记录。删除可以通过电话簿列表中每个人专用的按钮来完成。你可以用[window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)方法来确认用户的操作：

![](../../images/2/24e.png)

<!-- The associated resource for a person in the backend can be deleted by making an HTTP DELETE request to the resource's URL. If we are deleting e.g. a person who has the <i>id</i> 2, we would have to make an HTTP DELETE request to the URL <i>localhost:3001/persons/2</i>. No data is sent with the request.-->
要删除后端中某个人的相关资源，可以通过对资源的URL发送HTTP DELETE请求。例如，如果我们要删除一个<i>id</i>为2的人，我们就必须向URL <i>localhost:3001/persons/2</i>发送HTTP DELETE请求。HTTP DELETE请求不发送任何数据。

<!-- You can make an HTTP DELETE request with the [axios](https://github.com/axios/axios) library in the same way that we make all of the other requests.-->
你依然可以用[axios](https://github.com/axios/axios)库发送HTTP DELETE请求，和我们发送其他所有请求的方式一样。

<!-- **NB:** You can't use the name <em>delete</em> for a variable because it's a reserved word in JavaScript. E.g. the following is not possible:-->
**注意：**你不能将<em>delete</em>作为变量名，因为它是JavaScript中的一个保留词。例如，不可以这么写：

```js
// use some other name for variable!
const delete = (id) => {
  // ...
}
```

<!-- <h4>2.15*: The Phonebook step 10</h4> -->
<h4>2.15*：电话簿 第10步</h4>

<!-- <i>Why is there an asterisk in the exercise? See [here](/en/part0/general_info#taking-the-course) for the explanation.</i> -->
<i>为什么这道练习有个星号？[这里](/zh/part0/基础知识#taking-the-course)有解释。</i>

<!-- Change the functionality so that if a number is added to an already existing user, the new number will replace the old number. It's recommended to use the HTTP PUT method for updating the phone number.-->
改变功能，如果向一个已经存在的用户添加号码，新的号码将替换旧的号码。建议使用HTTP PUT方法来更新电话号码。

<!-- If the person's information is already in the phonebook, the application can confirm the action from the user:-->
如果这个人的信息已经在电话簿中，应用可以让用户确认这个操作：

![](../../images/teht/16e.png)

</div>
