---
mainImage: ../../../images/part-2.svg
part: 2
letter: d
lang: zh
---

<div class="content">

<!-- When creating notes in our application, we would naturally want to store them in some backend server. The [json-server](https://github.com/typicode/json-server) package claims to be a so-called REST or RESTful API in its documentation:-->
当在我们的应用程序中创建笔记时，我们自然希望将它们存储在某个后端服务器中。[json-server](https://github.com/typicode/json-server) 包在其文档中声称是所谓的REST或RESTful API：

<!-- > <i>Get a full fake REST API with zero coding in less than 30 seconds (seriously)</i>-->
> <i>用不到30秒，就能轻松拥有一个完整的假REST API（真的）</i>

<!-- The json-server does not exactly match the description provided by the textbook [definition](https://en.wikipedia.org/wiki/Representational_state_transfer) of a REST API, but neither do most other APIs claiming to be RESTful.-->
JSON-Server与教科书提供的[定义](https://en.wikipedia.org/wiki/Representational_state_transfer)的REST API并不完全匹配，但大多数声称是RESTful的其他API也是如此。

<!-- We will take a closer look at REST in the [next part](/en/part3) of the course. But it''s important to familiarize ourselves at this point with some of the [conventions](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) used by json-server and REST APIs in general. In particular, we will be taking a look at the conventional use of [routes](https://github.com/typicode/json-server#routes), aka URLs and HTTP request types, in REST.-->
我们将在课程的[下一部分](/en/part3)中更深入地研究REST。但是在这一点上，重要的是让我们熟悉json-server和REST API中使用的一些[约定](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services)。特别是，我们将研究REST中传统使用的[路由](https://github.com/typicode/json-server#routes)，也就是URL和HTTP请求类型。

### REST

<!-- In REST terminology, we refer to individual data objects, such as the notes in our application, as <i>resources</i>. Every resource has a unique address associated with it - its URL. According to a general convention used by json-server, we would be able to locate an individual note at the resource URL <i>notes/3</i>, where 3 is the id of the resource. The <i>notes</i> URL, on the other hand, would point to a resource collection containing all the notes.-->
在REST术语中，我们称之为<i>资源</i>的单个数据对象，比如我们应用程序中的笔记。每个资源都有一个与其关联的唯一地址，即其URL。根据json-server使用的一般约定，我们可以在资源URL <i>notes/3</i>中定位单个笔记，其中3是资源的id。另一方面，<i>notes</i> URL将指向包含所有笔记的资源集合。

<!-- Resources are fetched from the server with HTTP GET requests. For instance, an HTTP GET request to the URL <i>notes/3</i> will return the note that has the id number 3. An HTTP GET request to the <i>notes</i> URL would return a list of all notes.-->
资源可以通过HTTP GET请求从服务器获取。例如，对URL <i>notes/3</i> 发起的HTTP GET请求将返回ID号为3的笔记。对<i>notes</i> URL发起的HTTP GET请求将返回所有笔记的列表。

<!-- Creating a new resource for storing a note is done by making an HTTP POST request to the <i>notes</i> URL according to the REST convention that the json-server adheres to. The data for the new note resource is sent in the <i>body</i> of the request.-->
创建一个新的资源来存储一个笔记，根据REST约定，json-server遵循，可以通过发送一个HTTP POST请求到<i>notes</i> URL来实现。新笔记资源的数据发送在请求的<i>body</i>中。

<!-- json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string and that the request must contain the <i>Content-Type</i> request header with the value <i>application/json</i>.-->
json-server要求所有数据以JSON格式发送。这在实践中意味着数据必须是正确格式化的字符串，并且请求必须包含<i>Content-Type</i>请求头，值为<i>application/json</i>。

### Sending Data to the Server

<!-- Let''s make the following changes to the event handler responsible for creating a new note:-->
让我们对负责创建新笔记的事件处理程序做出以下更改：

```js
addNote = event => {
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

<!-- We create a new object for the note but omit the <i>id</i> property since it''s better to let the server generate ids for our resources!-->
我们为笔记创建了一个新的对象，但是省略了<i>id</i>属性，因为让服务器为我们的资源生成id更好！

<!-- The object is sent to the server using the axios <em>post</em> method. The registered event handler logs the response that is sent back from the server to the console.-->
使用axios的<em>post</em>方法将对象发送到服务器。注册的事件处理程序将从服务器发回的响应记录到控制台。

<!-- When we try to create a new note, the following output pops up in the console:-->
当我们尝试创建一个新笔记时，控制台会弹出以下输出：

![data json output in console](../../images/2/20new.png)

<!-- The newly created note resource is stored in the value of the <i>data</i> property of the _response_ object.-->
新创建的笔记资源存储在_response_ 对象的<i>data</i> 属性的值中。

<!-- Quite often it is useful to inspect HTTP requests in the <i>Network</i> tab of Chrome developer tools, which was used heavily at the beginning of [part 0](/en/part0/fundamentals_of_web_apps#http-get).-->
常常在Chrome开发者工具的<i>网络</i>标签中检查HTTP请求是很有用的，它在[part 0](/en/part0/fundamentals_of_web_apps#http-get)的开始就被大量使用了。

<!-- We can use the inspector to check that the headers sent in the POST request are what we expected them to be:-->
我们可以使用检查器来检查POST请求中发送的标头是我们期望的标头：

![dev tools header shows 201 created for localhost:3001/notes](../../images/2/21new1.png)

<!-- Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate <i>application/json</i> value for the <i>Content-Type</i> header.-->
由于我们在POST请求中发送的数据是一个JavaScript对象，axios自动知道为<i>Content-Type</i>头设置适当的<i>application/json</i>值。

<!-- The tab <i>payload</i> can be used to check the request data:-->
<i>payload</i> 选项可用于检查请求数据：

![devtools payload tab shows content and important fields from above](../../images/2/21new2.png)

<!-- Also the tab <i>response</i> is useful, it shows what was the data the server responded with:-->
也可以使用<i>response</i> 选项卡，它显示服务器响应的数据是什么：

![devtools response tab shows same content as payload but with id field too](../../images/2/21new3.png)

<!-- The new note is not rendered to the screen yet. This is because we did not update the state of the <i>App</i> component when we created the new note. Let''s fix this:-->
新笔记还没有呈现到屏幕上。这是因为我们在创建新笔记时没有更新<i>App</i>组件的状态。让我们来修复这个问题：

```js
addNote = event => {
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
新的笔记由后端服务器返回，以我们应用程序状态中习惯的方式使用<em>setNotes</em>函数添加到笔记列表中，然后重置笔记创建表单。[重要细节](/en/part1/a_more_complex_state_debugging_react_apps#handling-arrays)要记住的是，<em>concat</em>方法不会改变组件的原始状态，而是创建一个新的列表副本。

<!-- Once the data returned by the server starts to have an effect on the behavior of our web applications, we are immediately faced with a whole new set of challenges arising from, for instance, the asynchronicity of communication. This necessitates new debugging strategies, console logging and other means of debugging become increasingly more important. We must also develop a sufficient understanding of the principles of both the JavaScript runtime and React components. Guessing won''t be enough.-->
一旦服务器返回的数据开始影响我们网络应用程序的行为，我们就立刻面临着一系列新的挑战，比如通信的异步性。这就需要新的调试策略，控制台日志和其他调试手段变得越来越重要。我们还必须充分理解JavaScript运行时和React组件的原理。猜测是不够的。

<!-- It''s beneficial to inspect the state of the backend server, e.g. through the browser:-->
审查后端服务器的状态有益，例如通过浏览器：

![JSON data output from backend](../../images/2/22e.png)

<!-- This makes it possible to verify that all the data we intended to send was actually received by the server.-->
这使得我们可以验证我们本来要发送的所有数据是否实际被服务器接收到。

<!-- In the next part of the course, we will learn to implement our own logic in the backend. We will then take a closer look at tools like [Postman](https://www.postman.com/downloads/) that helps us to debug our server applications. However, inspecting the state of the json-server through the browser is sufficient for our current needs.-->
在课程的下一部分，我们将学习如何在后端实现自己的逻辑。然后，我们将更加仔细地研究像[Postman](https://www.postman.com/downloads/)这样的工具，它可以帮助我们调试服务器应用程序。但是，通过浏览器检查json-server的状态对于我们目前的需求已经足够了。

<!-- The code for the current state of our application can be found in the  <i>part2-5</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-5).-->
代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-5)上的<i>part2-5</i>分支找到，它代表我们应用程序当前的状态。

### Changing the Importance of Notes

<!-- Let''s add a button to every note that can be used for toggling its importance.-->
让我们为每一个笔记添加一个按钮，用于切换其重要性。

<!-- We make the following changes to the <i>Note</i> component:-->
我们对<i>Note</i>组件做出了以下更改：

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

<!-- We add a button to the component and assign its event handler as the <em>toggleImportance</em> function passed in the component''s props.-->
我们在组件中添加了一个按钮，并将其事件处理程序分配为组件props中传入的<em>toggleImportance</em>函数。

<!-- The <i>App</i> component defines an initial version of the <em>toggleImportanceOf</em> event handler function and passes it to every <i>Note</i> component:-->
<i>App</i> 组件定义了一个 <em>toggleImportanceOf</em> 事件处理函数的初始版本，并将其传递给每个 <i>Note</i> 组件：

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

<!-- Notice how every note receives its own <i>unique</i> event handler function since the <i>id</i> of every note is unique.-->
注意每个笔记都有自己<i>独特</i>的事件处理函数，因为每个笔记的<i>id</i>都是独一无二的。

<!-- E.g., if <i>note.id</i> is 3, the event handler function returned by _toggleImportance(note.id)_ will be:-->
如果<i>note.id</i>是3，由_toggleImportance(note.id)_返回的事件处理函数将是：

```js
() => { console.log('importance of 3 needs to be toggled') }
```

<!-- A short reminder here. The string printed by the event handler is defined in a Java-like manner by adding the strings:-->
一个简短的提醒：通过事件处理程序打印的字符串可以通过以Java的方式添加字符串来定义。

```js
console.log('importance of ' + id + ' needs to be toggled')
```

<!-- The [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax added in ES6 can be used to write similar strings in a much nicer way:-->
ES6 中新增的[模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)语法可用于以更好的方式编写类似的字符串：

```js
console.log(`importance of ${id} needs to be toggled`)
```

<!-- We can now use the "dollar-bracket"-syntax to add parts to the string that will evaluate JavaScript expressions, e.g. the value of a variable. Note that we use backticks in template strings instead of quotation marks used in regular JavaScript strings.-->
我们现在可以使用「美元-括号」语法来将部分添加到字符串中，该字符串将评估JavaScript表达式，例如变量的值。请注意，我们在模板字符串中使用反引号，而不是在普通JavaScript字符串中使用的引号。

<!-- Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL. We can either <i>replace</i> the entire note with an HTTP PUT request or only change some of the note's properties with an HTTP PATCH request.-->
在json-server后端存储的单个笔记可以通过向该笔记的唯一URL发出HTTP请求来进行两种不同的修改。我们可以使用HTTP PUT请求<i>替换</i>整个笔记，或者只使用HTTP PATCH请求更改笔记的某些属性。

<!-- The final form of the event handler function is the following:-->
最终的事件处理函数形式如下：

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(n => n.id !== id ? n : response.data))
  })
}
```

<!-- Almost every line of code in the function body contains important details. The first line defines the unique URL for each note resource based on its id.-->
几乎每一行函数体中的代码都包含重要的细节。第一行定义了每个笔记资源的唯一URL，基于它的id。

<!-- The array [find method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) is used to find the note we want to modify, and we then assign it to the _note_ variable.-->
数组[find 方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)用于找到我们要修改的笔记，然后将其分配给_note_变量。

<!-- After this, we create a <i>new object</i> that is an exact copy of the old note, apart from the important property that has the value flipped (from true to false or from false to true).-->
之后，我们创建一个<i>新对象</i>，它是旧对象的完全副本，但重要属性的值被翻转（从true变成false或者从false变成true）。

<!-- The code for creating the new object that uses the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax may seem a bit strange at first:-->
代码创建一个新对象使用[对象展开](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)语法可能一开始会有点奇怪：

```js
const changedNote = { ...note, important: !note.important }
```

<!-- In practice, <em>{ ...note }</em> creates a new object with copies of all the properties from the _note_ object. When we add properties inside the curly braces after the spread object, e.g. <em>{ ...note, important: true }</em>, then the value of the _important_ property of the new object will be _true_. In our example, the <em>important</em> property gets the negation of its previous value in the original object.-->
在实践中，<em>{ ...note }</em>创建一个新对象，对_note_对象的所有属性进行拷贝。当我们在花括号中添加属性时，例如<em>{ ...note, important: true }</em>，那么新对象的_important_属性的值将为_true_。在我们的示例中，<em>important</em>属性在原始对象中获得其先前值的否定。

<!-- There are a few things to point out. Why did we make a copy of the note object we wanted to modify when the following code also appears to work?-->
这里有几件事要指出。当以下代码似乎也能正常工作时，为什么我们还要复制要修改的note对象？

```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
```

<!-- This is not recommended because the variable <em>note</em> is a reference to an item in the <em>notes</em> array in the component''s state, and as we recall we must [never mutate state directly](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react) in React.-->
这不推荐，因为变量<em>note</em>是指组件状态中的<em>notes</em>数组中的一个项目，正如我们所知，我们必须[永远不要直接改变状态](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react)在React中。

<!-- It''s also worth noting that the new object _changedNote_ is only a so-called [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy), meaning that the values of the new object are the same as the values of the old object. If the values of the old object were objects themselves, then the copied values in the new object would reference the same objects that were in the old object.-->
值得注意的是，新对象_changedNote_只是所谓的[浅拷贝](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy)，这意味着新对象的值与旧对象的值相同。如果旧对象的值本身是对象，那么新对象中复制的值将引用旧对象中的相同对象。

<!-- The new note is then sent with a PUT request to the backend where it will replace the old object.-->
新笔记随着一个PUT请求发送到后端，它将取代旧的对象。

<!-- The callback function sets the component''s <em>notes</em> state to a new array that contains all the items from the previous <em>notes</em> array, except for the old note which is replaced by the updated version of it returned by the server:-->
回调函数将组件的<em>笔记</em>状态设置为一个新的数组，该数组包含了以前<em>笔记</em>数组中的所有项，除了旧笔记，它被服务器返回的更新版本所取代：

```js
axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id !== id ? note : response.data))
})
```

<!-- This is accomplished with the <em>map</em> method:-->
这是通过<em>map</em>方法实现的：

```js
notes.map(note => note.id !== id ? note : response.data)
```

<!-- The map method creates a new array by mapping every item from the old array into an item in the new array. In our example, the new array is created conditionally so that if <em>note.id !== id</em> is true; we simply copy the item from the old array into the new array. If the condition is false, then the note object returned by the server is added to the array instead.-->
map 方法通过将旧数组中的每一项映射到新数组中的一项来创建一个新的数组。在我们的例子中，新数组是有条件地创建的，因此，如果 <em>note.id !== id</em> 为真，则仅从旧数组中复制项到新数组中。如果条件为假，则服务器返回的笔记对象将添加到数组中。

<!-- This <em>map</em> trick may seem a bit strange at first, but it''s worth spending some time wrapping your head around it. We will be using this method many times throughout the course.-->
这个<em>地图</em>技巧可能一开始会有点奇怪，但值得花点时间去理解它。我们在整个课程中会多次使用这种方法。

### Extracting Communication with the Backend into a Separate Module

<!-- The <i>App</i> component has become somewhat bloated after adding the code for communicating with the backend server. In the spirit of the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), we deem it wise to extract this communication into its own [module](/en/part2/rendering_a_collection_modules#refactoring-modules).-->
<i>App</i> 组件在添加与后端服务器通信的代码后变得有些臃肿。为了符合[单一职责原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)，我们认为最好将这种通信抽取到自己的[模块](/en/part2/rendering_a_collection_modules#refactoring-modules)中去。

<!-- Let''s create a <i>src/services</i> directory and add a file there called <i>notes.js</i>:-->
让我们创建一个<i>src/services</i>目录，并在其中添加一个叫<i>notes.js</i>的文件：

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
模块返回一个对象，它具有三个函数（<i>getAll</i>，<i>create</i>和<i>update</i>）作为它的属性，处理笔记。这些函数直接返回axios方法返回的promise。

<!-- The <i>App</i> component uses <em>import</em> to get access to the module:-->
<i>App</i> 组件使用 <em>import</em> 来获取模块的访问权限：

```js
import noteService from './services/notes' // highlight-line

const App = () => {
```

<!-- The functions of the module can be used directly with the imported variable _noteService_ as follows:-->
模块的功能可以通过导入的变量`_noteService_`直接使用，如下所示：

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
        setNotes(notes.map(note => note.id !== id ? note : response.data))
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
我们可以将我们的实现推进一步。当<i>App</i>组件使用功能时，它收到一个对象，其中包含HTTP请求的整个响应：

```js
noteService
  .getAll()
  .then(response => {
    setNotes(response.data)
  })
```

<!-- The <i>App</i> component only uses the <i>response.data</i> property of the response object.-->
<i>App</i> 组件只使用响应对象的 <i>response.data</i> 属性。

<!-- The module would be much nicer to use if, instead of the entire HTTP response, we would only get the response data. Using the module would then look like this:-->
如果不是整个HTTP响应，而是只得到响应数据，那么使用这个模块会更好。使用这个模块看起来就像这样：

```js
noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })
```

<!-- We can achieve this by changing the code in the module as follows (the current code contains some copy-paste, but we will tolerate that for now):-->
我们可以通过改变模块中的代码来实现这一点（当前的代码中包含了一些复制粘贴，但我们现在可以容忍这一点）：

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
我们不再直接返回 axios 返回的 promise，而是将 promise 赋值给 <em>request</em> 变量，并调用它的 <em>then</em> 方法：

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```

<!-- The last row in our function is simply a more compact expression of the same code as shown below:-->
最后一行在我们的函数中只是下面显示的代码的更加紧凑的表达：

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
修改后的<em>getAll</em>函数仍然返回一个promise，因为promise的<em>then</em>方法也[返回一个promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)。

<!-- After defining the parameter of the <em>then</em> method to directly return <i>response.data</i>, we have gotten the <em>getAll</em> function to work like we wanted it to. When the HTTP request is successful, the promise returns the data sent back in the response from the backend.-->
在定义了<em>then</em>方法的参数以直接返回<i>response.data</i>后，我们已经让<em>getAll</em>函数按照我们所想的那样工作了。当HTTP请求成功时，承诺会返回后端发回的响应中的数据。

<!-- We have to update the <i>App</i> component to work with the changes made to our module.  We have to fix the callback functions given as parameters to the <em>noteService</em> object''s methods so that they use the directly returned response data:-->
我们必须更新<i>App</i>组件以适应我们模块的变更。我们必须修复给<em>noteService</em>对象方法的回调函数，使它们使用直接返回的响应数据：

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
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
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
这一切都相当复杂，试图解释它可能只会使它更难理解。 互联网上充满了讨论这个话题的材料，比如[这个](https://javascript.info/promise-chaining)。

<!-- The "Async and performance" book from the [You do not know JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) book series [explains the topic](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md) well, but the explanation is many pages long.-->
《[你不知道的JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed)系列书籍中的《异步与性能》一书[很详细地解释了这个主题](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md)，但是解释的页数很长。

<!-- Promises are central to modern JavaScript development and it is highly recommended to invest a reasonable amount of time into understanding them.-->
承诺在现代JavaScript开发中至关重要，强烈建议花一定的时间去理解它们。

### Cleaner Syntax for Defining Object Literals

<!-- The module defining note-related services currently exports an object with the properties <i>getAll</i>, <i>create</i>, and <i>update</i> that are assigned to functions for handling notes.-->
模块定义与笔记相关的服务，当前导出一个对象，其属性<i>getAll</i>, <i>create</i>, 和 <i>update</i> 分别被赋予用于处理笔记的函数。

<!-- The module definition was:-->
模块定义是：

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
模块输出以下看起来比较特别的对象：

```js
{
  getAll: getAll,
  create: create,
  update: update
}
```

<!-- The labels to the left of the colon in the object definition are the <i>keys</i> of the object, whereas the ones to the right of it are <i>variables</i> that are defined inside the module.-->
左边等号前的标签是对象定义中的<i>键</i>，而右边等号后的是<i>变量</i>，它们是在模块中定义的。

<!-- Since the names of the keys and the assigned variables are the same, we can write the object definition with a more compact syntax:-->
因为键的名称和分配的变量是相同的，我们可以使用更紧凑的语法来编写对象定义：

```js
{
  getAll,
  create,
  update
}
```

<!-- As a result, the module definition gets simplified into the following form:-->
结果，模块定义被简化为以下形式：

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
在使用这种较短的表示法定义对象时，我们利用了[ES6引入的新特性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions)，使得可以使用变量以更紧凑的方式定义对象。

<!-- To demonstrate this feature, let''s consider a situation where we have the following values assigned to variables:-->
展示这个特性，让我们考虑一个情况，我们把下面的值赋值给变量：

```js
const name = 'Leevi'
const age = 0
```

<!-- In older versions of JavaScript we had to define an object like this:-->
在JavaScript的较旧版本中，我们必须像这样定义一个对象：

```js
const person = {
  name: name,
  age: age
}
```

<!-- However, since both the property fields and the variable names in the object are the same, it''s enough to simply write the following in ES6 JavaScript:-->
但是，由于对象中的属性字段和变量名相同，因此在ES6 JavaScript中只需简单地编写以下内容即可：

```js
const person = { name, age }
```

<!-- The result is identical for both expressions. They both create an object with a <i>name</i> property with the value <i>Leevi</i> and an <i>age</i> property with the value <i>0</i>.-->
结果两个表达式是一致的。他们都创建一个带有<i>name</i>属性，值为<i>Leevi</i>，以及<i>age</i>属性，值为<i>0</i>的对象。

### Promises and Errors

<!-- If our application allowed users to delete notes, we could end up in a situation where a user tries to change the importance of a note that has already been deleted from the system.-->
如果我们的应用允许用户删除笔记，我们可能会陷入一种情况，即用户试图更改已从系统中删除的笔记的重要性。

<!-- Let''s simulate this situation by making the <em>getAll</em> function of the note service return a "hardcoded" note that does not actually exist on the backend server:-->
让我们通过使note服务的<em>getAll</em>函数返回一个"硬编码"的note，来模拟这种情况，该note实际上不存在于后端服务器中：

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
当我们尝试更改硬编码注释的重要性时，我们在控制台中看到以下错误消息。错误提示后端服务器对我们的HTTP PUT请求响应状态码404 <i>未找到</i>。

![404 not found error in dev tools](../../images/2/23e.png)

<!-- The application should be able to handle these types of error situations gracefully. Users won't be able to tell that an error has occurred unless they happen to have their console open. The only way the error can be seen in the application is that clicking the button does not affect the note's importance.-->
应用程序应该能够优雅地处理这些类型的错误情况。除非用户有打开控制台，否则他们无法知道发生了错误。错误唯一可以在应用程序中看到的是点击按钮不会影响笔记的重要性。

<!-- We had [previously](/en/part2/getting_data_from_server#axios-and-promises) mentioned that a promise can be in one of three different states. When an HTTP request fails, the associated promise is <i>rejected</i>. Our current code does not handle this rejection in any way.-->
我们之前[曾经](/en/part2/getting_data_from_server#axios-and-promises)提到，一个承诺可以处于三种不同的状态之一。当HTTP请求失败时，相关的承诺会被<i>拒绝</i>。我们目前的代码没有以任何方式处理这种拒绝。

<!-- The rejection of a promise is [handled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) by providing the <em>then</em> method with a second callback function, which is called in the situation where the promise is rejected.-->
拒绝一个承诺是通过提供一个第二个回调函数[处理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)，该回调函数在承诺被拒绝的情况下被调用。<em>then</em>方法。

<!-- The more common way of adding a handler for rejected promises is to use the [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method.-->
更常见的添加处理被拒绝的promise的方式是使用[catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)方法。

<!-- In practice, the error handler for rejected promises is defined like this:-->
在实务上，拒绝的承诺的错误处理程序是这样定义的：

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
如果请求失败，则会调用用<em>catch</em>方法注册的事件处理程序。

<!-- The <em>catch</em> method is often utilized by placing it deeper within the promise chain.-->
<em>catch</em> 方法通常被用于把它放在 promise 链的更深处。

<!-- When our application makes an HTTP request, we are in fact creating a [promise chain](https://javascript.info/promise-chaining):-->
当我们的应用程序发出HTTP请求时，我们实际上是在创建一个[promise chain](https://javascript.info/promise-chaining)：

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then(response => response.data)
  .then(changedNote => {
    // ...
  })
```

<!-- The <em>catch</em> method can be used to define a handler function at the end of a promise chain, which is called once any promise in the chain throws an error and the promise becomes <i>rejected</i>.-->
<em>捕获</em>方法可用于在promise链的末尾定义一个处理函数，当链中的任何promise抛出错误并且promise变为<i>拒绝</i>时调用该函数。

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then(response => response.data)
  .then(changedNote => {
    // ...
  })
  .catch(error => {
    console.log('fail')
  })
```

<!-- Let''s use this feature and register an error handler in the <i>App</i> component:-->
让我们使用这个功能，在<i>App</i>组件中注册一个错误处理程序：

```js
const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
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
错误消息以及信任的[警报](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)对话框弹出框显示给用户，而被删除的笔记则被过滤出状态。

<!-- Removing an already deleted note from the application''s state is done with the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method, which returns a new array comprising only the items from the list for which the function that was passed as a parameter returns true for:-->
使用[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 方法从应用程序的状态中移除已删除的笔记，该方法返回一个新数组，其中仅包含传递给参数的函数为真的列表项：

```js
notes.filter(n => n.id !== id)
```

<!-- It's probably not a good idea to use alert in more serious React applications. We will soon learn a more advanced way of displaying messages and notifications to users. There are situations, however, where a simple, battle-tested method like <em>alert</em> can function as a starting point. A more advanced method could always be added in later, given that there's time and energy for it.-->
可能不是一个好主意在更严肃的React应用中使用alert。我们很快就会学习一种更高级的向用户显示消息和通知的方法。然而，有些情况下，一个简单而又经过检验的方法，比如<em>alert</em>可以作为一个起点。如果有足够的时间和精力，总是可以添加一种更高级的方法。

<!-- The code for the current state of our application can be found in the  <i>part2-6</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-6).-->
当前应用程序的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-6)上的<i>part2-6</i>分支中找到。

### Full stack developer''s oath

<!-- It is again time for the exercises. The complexity of our app is now increasing since besides just taking care of the React components in the frontend, we also have a backend that is persisting the application data.-->
这又是时候做练习了。我们的应用的复杂性现在正在增加，因为除了只关心前端的React组件，我们还有一个后端来持久化应用数据。

<!-- To cope with the increasing complexity we should extend the web developer's oath to a <i>Full stack developer's oath</i>, which reminds us to make sure that the communication between frontend and backend happens as expected.-->
为了应对日益增加的复杂性，我们应该将 Web 开发者宣言扩展为<i>全栈开发者宣言</i>，它提醒我们确保前端和后端之间的通信按预期发生。

<!-- So here is the updated oath:-->
所以这里是更新后的誓言：

<!-- Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier-->
.

全栈开发<i>非常困难</i>，这就是为什么我要用尽一切可能的手段来使它变得更容易。

<!-- - I will have my browser developer console open all the time-->
我会一直开著浏览器的开发者控制台。
<!-- - <i>I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect</i>-->
我将使用浏览器开发工具的网络选项卡来确保前端和后端按照我的预期进行通信。
<!-- - <i>I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect</i>-->
我会不断关注服务器的状态，以确保前端发送到那里的数据按我的期望保存在那里。
<!-- - I progress with small steps-->
我一步一步地前进。
<!-- - I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpoint problems-->
.

我会写很多`console.log`语句来确保我理解代码的行为，并帮助确定问题。
<!-- - If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working-->
.

如果我的代码不起作用，我不会写更多的代码。相反，我开始删除代码，直到它可以工作，或者只是返回到一个所有事情都还在运行的状态。
<!-- - When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram) how to ask for help-->
当我在课程Discord或Telegram频道或其他地方寻求帮助时，我会正确地提出我的问题，请参见[这里](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram)如何寻求帮助。

</div>

<div class="tasks">

<h3>Exercises 2.12.-2.15.</h3>

<h4>2.12: The Phonebook step7</h4>

<!-- Let''s return to our phonebook application.-->
# 让我们回到我们的电话簿应用程序。

<!-- Currently, the numbers that are added to the phonebook are not saved to a backend server. Fix this situation.-->
目前，添加到电话簿的号码没有保存到后端服务器。解决这种情况。

<h4>2.13: The Phonebook step8</h4>

<!-- Extract the code that handles the communication with the backend into its own module by following the example shown earlier in this part of the course material.-->
按照本课程资料中早先展示的例子，将处理与后端通信的代码提取到自己的模块中。

<h4>2.14: The Phonebook step9</h4>

<!-- Make it possible for users to delete entries from the phonebook. The deletion can be done through a dedicated button for each person in the phonebook list. You can confirm the action from the user by using the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) method:-->
使用户能够从电话簿中删除条目。 删除可以通过电话簿列表中每个人的专用按钮完成。 您可以通过使用[window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)方法从用户处确认此操作：

![2.17 window confirm feature screeshot](../../images/2/24e.png)

<!-- The associated resource for a person in the backend can be deleted by making an HTTP DELETE request to the resource''s URL. If we are deleting e.g. a person who has the <i>id</i> 2, we would have to make an HTTP DELETE request to the URL <i>localhost:3001/persons/2</i>. No data is sent with the request.-->
通过向资源的URL发送 HTTP DELETE 请求可以删除后端的关联资源。例如，如果我们要删除具有 <i>id</i> 2 的人，我们必须向URL <i>localhost:3001/persons/2</i> 发送 HTTP DELETE 请求。请求中不发送数据。

<!-- You can make an HTTP DELETE request with the [axios](https://github.com/axios/axios) library in the same way that we make all of the other requests.-->
你可以用[axios](https://github.com/axios/axios)库以同样的方式发出一个HTTP DELETE请求。

<!-- **NB:** You can't use the name <em>delete</em> for a variable because it's a reserved word in JavaScript. E.g. the following is not possible:-->
**注意：** 你不能在JavaScript中把变量名叫做<em>delete</em>，因为它是一个保留字。例如，下面的是不可能的：

```js
// use some other name for variable!
const delete = (id) => {
  // ...
}
```

<h4>2.15*: The Phonebook step10</h4>

<i>Why is there a star in the exercise? See [here](/en/part0/general_info#taking-the-course) for the explanation.</i>

<!-- Change the functionality so that if a number is added to an already existing user, the new number will replace the old number. It''s recommended to use the HTTP PUT method for updating the phone number.-->
更改功能，使得如果向已存在的用户添加数字，则新数字将替换旧数字。建议使用HTTP PUT方法来更新电话号码。

<!-- If the person''s information is already in the phonebook, the application can ask the user to confirm the action:-->
如果该人的信息已经在电话簿中，应用程序可以要求用户确认该操作：

![2.18 screenshot alert confirmation](../../images/teht/16e.png)

</div>
