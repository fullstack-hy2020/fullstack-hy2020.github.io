---
mainImage: ../../../images/part-2.svg
part: 2
letter: d
lang: zh
---

<div class="content">


<!-- When creating notes in our application, we would naturally want to store them in some backend server. The [json-server](https://github.com/typicode/json-server) package claims to be a so-called REST or RESTful API in its documentation:-->
 当在我们的应用中创建笔记时，我们自然希望将它们存储在某个后端服务器中。[json-server](https://github.com/typicode/json-server)包在其文档中声称是一个所谓的REST或RESTful API。

<!-- > <i>Get a full fake REST API with zero coding in less than 30 seconds (seriously)</i>-->
 > <i>在30秒内以零编码获得一个完整的假REST API（认真的）</i>。

<!-- The json-server does not exactly match the description provided by the textbook [definition](https://en.wikipedia.org/wiki/Representational_state_transfer) of a REST API, but neither do most other APIs claiming to be RESTful.-->
 json-server并不完全符合教科书[定义](https://en.wikipedia.org/wiki/Representational_state_transfer)提供的REST API的描述，但其他大多数声称是RESTful的API也不符合。

<!-- We will take a closer look at REST in the [next part](/en/part3) of the course. But it's important to familiarize ourselves at this point with some of the [conventions](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) used by json-server and REST APIs in general. In particular, we will be taking a look at the conventional use of [routes](https://github.com/typicode/json-server#routes), aka URLs and HTTP request types, in REST.-->
 我们将在课程的[下一部分](/en/part3)中仔细研究REST。但是，在这一点上，我们有必要熟悉json-server和REST APIs一般使用的一些[约定](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services)。特别是，我们将看看REST中[路由](https://github.com/typicode/json-server#routes)的常规使用，也就是URL和HTTP请求类型。

### REST

<!-- In REST terminology, we refer to individual data objects, such as the notes in our application, as <i>resources</i>. Every resource has a unique address associated with it - its URL. According to a general convention used by json-server, we would be able to locate an individual note at the resource URL <i>notes/3</i>, where 3 is the id of the resource. The <i>notes</i> url, on the other hand, would point to a resource collection containing all the notes.-->
 在REST术语中，我们把单个数据对象，如我们应用中的笔记，称为<i>资源</i>。每个资源都有一个与之相关的唯一地址--它的URL。根据json-server使用的一般惯例，我们可以通过资源URL <i>notes/3</i>找到一个单独的笔记，其中3是资源的id。另一方面，<i>notes</i>网址将指向一个包含所有笔记的资源集合。

<!-- Resources are fetched from the server with HTTP GET requests. For instance, an HTTP GET request to the URL <i>notes/3</i> will return the note that has the id number 3. An HTTP GET request to the <i>notes</i> URL would return a list of all notes.-->
 资源是通过HTTP GET请求从服务器获取的。例如，对URL <i>notes/3</i>的HTTP GET请求将返回ID为3的笔记。对<i>notes</i> URL的HTTP GET请求将返回所有笔记的列表。

<!-- Creating a new resource for storing a note is done by making an HTTP POST request to the <i>notes</i> URL according to the REST convention that the json-server adheres to. The data for the new note resource is sent in the <i>body</i> of the request.-->
 根据json-server所遵守的REST惯例，通过向<i>notes</i> URL发出HTTP POST请求来创建一个用于存储笔记的新资源。新笔记资源的数据在请求的<i>body</i>中发送。

<!-- json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string, and that the request must contain the <i>Content-Type</i> request header with the value <i>application/json</i>.-->
 json-server要求所有数据以JSON格式发送。这实际上意味着数据必须是格式正确的字符串，而且请求必须包含<i>Content-Type</i>请求头，值为<i>application/json</i>。

### Sending Data to the Server

<!-- Let's make the following changes to the event handler responsible for creating a new note:-->
 让我们对负责创建一个新笔记的事件处理程序做如下修改。

```js
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
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

<!-- We create a new object for the note but omit the <i>id</i> property, since it's better to let the server generate ids for our resources!-->
 我们为注释创建一个新的对象，但省略了<i>id</i>属性，因为最好让服务器为我们的资源生成id!

<!-- The object is sent to the server using the axios <em>post</em> method. The registered event handler logs the response that is sent back from the server to the console.-->
 该对象使用axios的<em>post</em>方法被发送到服务器。注册的事件处理程序记录了从服务器发回控制台的响应。

<!-- When we try to create a new note, the following output pops up in the console:-->
 当我们尝试创建一个新的笔记时，控制台中会弹出以下输出。

![](../../images/2/20e.png)

<!-- The newly created note resource is stored in the value of the <i>data</i> property of the _response_ object.-->
 新创建的笔记资源被存储在_response_对象的<i>data</i>属性值中。

<!-- Sometimes it can be useful to inspect HTTP requests in the <i>Network</i> tab of Chrome developer tools, which was used heavily at the beginning of [part 0](/en/part0/fundamentals_of_web_apps#http-get):-->
有时在Chrome开发工具的<i>Network</i>标签中检查HTTP请求会很有用，在[第0章节](/en/part0/fundamentals_of_web_apps#http-get)的开头就大量使用了这个标签。

![](../../images/2/21e.png)

<!-- We can use the inspector to check that the headers sent in the POST request are what we expected them to be, and that their values are correct.-->
 我们可以使用检查器来检查POST请求中发送的头信息是否是我们所期望的，以及它们的值是否正确。

<!-- Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate <i>application/json</i> value for the <i>Content-Type</i> header.-->
 由于我们在POST请求中发送的数据是一个JavaScript对象，axios自动知道为<i>Content-Type</i>头设置适当的<i>application/json</i>值。

<!-- The new note is not rendered to the screen yet. This is because we did not update the state of the <i>App</i> component when we created the new note. Let's fix this:-->
 新的注释还没有渲染在屏幕上。这是因为我们在创建新笔记时没有更新<i>App</i>组件的状态。让我们来解决这个问题。

```js
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
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
 后台服务器返回的新笔记被添加到我们应用的状态中的笔记列表中，习惯的方法是使用<em>setNotes</em>函数，然后重设笔记创建表单。一个需要记住的[重要细节](/en/part1/a_more_complex_state_debugging_react_apps#handling-arrays)是，<em>concat</em>方法并不改变组件的原始状态，而是创建一个新的列表副本。

<!-- Once the data returned by the server starts to have an effect on the behavior of our web applications, we are immediately faced with a whole new set of challenges arising from, for instance, the asynchronicity of communication. This necessitates new debugging strategies, console logging and other means of debugging become increasingly more important. We must also develop a sufficient understanding of the principles of both the JavaScript runtime and React components. Guessing won't be enough.-->
 一旦服务器返回的数据开始对我们的Web应用的行为产生影响，我们就会立即面临一系列新的挑战，例如，通信的非同步性。这就需要新的调试策略，控制台记录和其他调试手段变得越来越重要。我们还必须对JavaScript运行时和React组件的原理有足够的了解。猜测是不够的。

<!-- It's beneficial to inspect the state of the backend server, e.g. through the browser:-->
 通过浏览器检查后端服务器的状态是有好处的。

![](../../images/2/22e.png)

<!-- This makes it possible to verify that all the data we intended to send was actually received by the server.-->
 这样就有可能验证我们打算发送的所有数据是否真的被服务器收到。

<!-- In the next part of the course we will learn to implement our own logic in the backend. We will then take a closer look at tools like [Postman](https://www.postman.com/downloads/) that helps us to debug our server applications. However, inspecting the state of the json-server through the browser is sufficient for our current needs.-->
 在课程的下一部分，我们将学习如何在后台实现我们自己的逻辑。然后我们将仔细研究像[Postman](https://www.postman.com/downloads/)这样的工具，它可以帮助我们调试我们的服务器应用。然而，通过浏览器检查json-server的状态已经足够满足我们目前的需要。

<!-- > **NB:** In the current version of our application, the browser adds the creation date property to the note. Since the clock of the machine running the browser can be wrongly configured, it's much wiser to let the backend server generate this timestamp for us. This is in fact what we will do in the next part of the course.-->
 > **NB:**在我们应用的当前版本中，浏览器将创建日期属性添加到注释中。由于运行浏览器的机器的时钟可能被错误地配置，让后端服务器为我们生成这个时间戳是非常明智的。事实上，这就是我们在课程的下一部分要做的。


<!-- The code for the current state of our application can be found in the  <i>part2-5</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-5).-->
 我们应用当前状态的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-5)上的<i>part2-5</i>分支找到。

### Changing the Importance of Notes

<!-- Let's add a button to every note that can be used for toggling its importance.-->
 让我们为每个笔记添加一个按钮，可以用来切换其重要性。

<!-- We make the following changes to the <i>Note</i> component:-->
 我们对<i>Note</i>组件做如下修改。

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
 我们给该组件添加一个按钮，并将其事件处理程序指定为组件prop中传递的<em>toggleImportance</em>函数。

<!-- The <i>App</i> component defines an initial version of the <em>toggleImportanceOf</em> event handler function and passes it to every <i>Note</i> component:-->
 <i>App</i>组件定义了一个初始版本的<em>toggleImportanceOf</em>事件处理函数，并将其传递给每个<i>Note</i>组件。

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
 注意每个笔记都收到它自己的<i>unique</i>事件处理函数，因为每个笔记的<i>id</i>是唯一的。

<!-- E.g., if <i>note.id</i> is 3, the event handler function returned by _toggleImportance(note.id)_ will be:-->
 例如，如果<i>note.id</i>是3，由_toggleImportance(note.id)_返回的事件处理函数将是。

```js
() => { console.log('importance of 3 needs to be toggled') }
```

<!-- A short reminder here. The string printed by the event handler is defined in Java-like manner by adding the strings:-->
 在此简单提醒一下。事件处理程序所打印的字符串是以类似于Java的方式定义的，即加入字符串。

```js
console.log('importance of ' + id + ' needs to be toggled')
```

<!-- The [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax added in ES6 can be used to write similar strings in a much nicer way:-->
 ES6中添加的[模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)语法可以用来以更漂亮的方式编写类似的字符串。

```js
console.log(`importance of ${id} needs to be toggled`)
```

<!-- We can now use the "dollar-bracket"-syntax to add parts to the string that will evaluate JavaScript expressions, e.g. the value of a variable. Note that the quotation marks used in template strings differ from the quotation marks used in regular JavaScript strings.-->
 我们现在可以使用 "美元括号 "语法在字符串中添加将计算JavaScript表达式的部分，例如一个变量的值。注意，模板字符串中使用的引号与普通JavaScript字符串中使用的引号不同。

<!-- Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL. We can either <i>replace</i> the entire note with an HTTP PUT request, or only change some of the note's properties with an HTTP PATCH request.-->
 存储在json-server后台的单个笔记可以通过对笔记的唯一URL进行HTTP请求，以两种不同方式进行修改。我们可以用HTTP PUT请求来替换</i>整个笔记，或者用HTTP PATCH请求只改变笔记的某些属性。

<!-- The final form of the event handler function is the following:-->
 事件处理函数的最终形式是这样的。

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id !== id ? note : response.data))
  })
}
```

<!-- Almost every line of code in the function body contains important details. The first line defines the unique url for each note resource based on its id.-->
 函数主体中几乎每一行代码都包含重要的细节。第一行定义了基于每个注释资源的id的唯一url。

<!-- The array [find method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) is used to find the note we want to modify, and we then assign it to the _note_ variable.-->
 数组[查找方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)被用来查找我们要修改的笔记，然后我们把它分配给_note_变量。

<!-- After this we create a <i>new object</i> that is an exact copy of the old note, apart from the important property.-->
 在这之后，我们创建一个<i>新对象</i>，除了重要的属性之外，它是旧笔记的完全拷贝。

<!-- The code for creating the new object that uses the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax may seem a bit strange at first:-->
 创建新对象的代码使用了[对象传播](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)的语法，一开始可能看起来有点奇怪。

```js
const changedNote = { ...note, important: !note.important }
```

<!-- In practice, <em>{ ...note }</em> creates a new object with copies of all the properties from the _note_ object. When we add properties inside the curly braces after the spread object, e.g. <em>{ ...note, important: true }</em>, then the value of the _important_ property of the new object will be _true_. In our example the <em>important</em> property gets the negation of its previous value in the original object.-->
 实际上，<em>{ ...note }</em>创建了一个新的对象，并复制了_note_对象的所有属性。当我们在传播对象后面的大括号内添加属性时，例如<em>{ ...note, important: true }</em>，那么新对象的_important_属性的值将是_true_。在我们的例子中，<em>important</em>属性得到了它在原始对象中先前值的否定。

<!-- There's a few things to point out. Why did we make a copy of the note object we wanted to modify, when the following code also appears to work?-->
 有几件事需要指出。为什么我们要复制一个我们想要修改的注解对象，而下面的代码似乎也可以工作？

```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
```

<!-- This is not recommended because the variable <em>note</em> is a reference to an item in the <em>notes</em> array in the component's state, and as we recall we must never mutate state directly in React.-->
 我们不推荐这样做，因为变量<em>note</em>是对组件状态中<em>notes</em>数组中的一个项目的引用，而我们记得我们决不能在React中直接改变状态。

<!-- It's also worth noting that the new object _changedNote_ is only a so-called [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy), meaning that the values of the new object are the same as the values of the old object. If the values of the old object were objects themselves, then the copied values in the new object would reference the same objects that were in the old object.-->
 还值得注意的是，新对象_changedNote_只是一个所谓的[浅层拷贝](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy)，意味着新对象的值与旧对象的值相同。如果旧对象的值本身是对象，那么新对象中的复制值将引用旧对象中的相同对象。

<!-- The new note is then sent with a PUT request to the backend where it will replace the old object.-->
 然后，新的注解会以PUT请求的方式发送到后端，在那里它将取代旧的对象。

<!-- The callback function sets the component's <em>notes</em> state to a new array that contains all the items from the previous <em>notes</em> array, except for the old note which is replaced by the updated version of it returned by the server:-->
 回调函数将组件的<em>notes</em>状态设置为一个新的数组，该数组包含了之前<em>notes</em>数组中的所有项目，除了旧的笔记，它被服务器返回的更新版本所取代。

```js
axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id !== id ? note : response.data))
})
```

<!-- This is accomplished with the <em>map</em> method:-->
 这是用<em>map</em>方法完成的。

```js
notes.map(note => note.id !== id ? note : response.data)
```

<!-- The map method creates a new array by mapping every item from the old array into an item in the new array. In our example, the new array is created conditionally so that if <em>note.id !== id</em> is true; we simply copy the item from the old array into the new array. If the condition is false, then the note object returned by the server is added to the array instead.-->
map方法通过将旧数组中的每个项目映射到新数组中的一个项目来创建一个新数组。在我们的例子中，新数组的创建是有条件的，如果<em>note.id !== id</em>为真，我们就把旧数组中的项目复制到新数组中。如果条件是假的，那么由服务器返回的笔记对象就会被添加到数组中。

<!-- This <em>map</em> trick may seem a bit strange at first, but it's worth spending some time wrapping your head around it. We will be using this method many times throughout the course.-->
 这个<em>map</em>技巧一开始可能有点奇怪，但值得花些时间去琢磨它。我们将在整个课程中多次使用这个方法。

### Extracting Communication with the Backend into a Separate Module


<!-- The <i>App</i> component has become somewhat bloated after adding the code for communicating with the backend server. In the spirit of the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), we deem it wise to extract this communication into its own [module](/en/part2/rendering_a_collection_modules#refactoring-modules).-->
 在添加了与后端服务器通信的代码后，<i>App</i>组件变得有些臃肿。本着[单一责任原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)，我们认为将这种通信提取到自己的[模块](/en/part2/rendering_a_collection_modules#refactoring-modules)是明智的。

<!-- Let's create a <i>src/services</i> directory and add a file there called <i>notes.js</i>:-->
 让我们创建一个<i>src/services</i>目录，并在那里添加一个名为<i>notes.js</i>的文件。

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
 该模块返回一个对象，该对象有三个函数（<i>getAll</i>、<i>create</i>和<i>update</i>）作为其属性，处理笔记。这些函数直接返回axios方法所返回的承诺。

<!-- The <i>App</i> component uses <em>import</em> to get access to the module:-->
 <i>App</i>组件使用<em>import</em>来获得对模块的访问。

```js
import noteService from './services/notes' // highlight-line

const App = () => {
```

<!-- The functions of the module can be used directly with the imported variable _noteService_ as follows:-->
 该模块的函数可以直接使用导入的变量_noteService_，如下所示。

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
      date: new Date().toISOString(),
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
 我们可以将我们的实现更进一步。当<i>App</i>组件使用这些函数时，它会收到一个包含HTTP请求的全部响应的对象。

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
 如果不是整个HTTP响应，而是只获得响应数据，那么这个模块的使用就会好得多。那么使用这个模块就会像这样。

```js
noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })
```

<!-- We can achieve this by changing the code in the module as follows (the current code contains some copy-paste, but we will tolerate that for now):-->
 我们可以通过改变模块中的代码来实现这个目标，如下所示（目前的代码包含一些复制粘贴的内容，但我们现在可以容忍这些）。

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
 我们不再直接返回axios返回的承诺。相反，我们将承诺分配给<em>request</em>变量并调用其<em>then</em>方法。

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```

<!-- The last row in our function is simply a more compact expression of the same code as shown below:-->
 我们函数中的最后一行只是对相同代码的一个更紧凑的表达，如下所示。

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
 修改后的<em>getAll</em>函数仍然返回一个承诺，因为一个承诺的<em>then</em>方法也[返回一个承诺](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)。

<!-- After defining the parameter of the <em>then</em> method to directly return <i>response.data</i>, we have gotten the <em>getAll</em> function to work like we wanted it to. When the HTTP request is successful, the promise returns the data sent back in the response from the backend.-->
 在定义了<em>then</em>方法的参数以直接返回<i>response.data</i>之后，我们已经让<em>getAll</em>函数像我们希望的那样工作。当HTTP请求成功时，promise会返回从后端响应中发回的数据。

<!-- We have to update the <i>App</i> component to work with the changes made to our module.  We have to fix the callback functions given as parameters to the <em>noteService</em> object's methods, so that they use the directly returned response data:-->
 我们必须更新<i>App</i>组件，以配合我们模块的变化。  我们必须修正作为参数给<em>noteService</em>对象的方法的回调函数，以便它们使用直接返回的响应数据。

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
      date: new Date().toISOString(),
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
 这一切都很复杂，试图解释它可能只是让它更难理解。互联网上有很多讨论这个话题的材料，比如[这个](https://javascript.info/promise-chaining)一个。

<!-- The "Async and performance" book from the [You do not know JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) book series [explains the topic](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md) well, but the explanation is many pages long.-->
[你不懂JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed)系列书籍中的 "异步和性能 "一书[很好地解释了这个话题](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md)，但解释的篇幅很多。

<!-- Promises are central to modern JavaScript development and it is highly recommended to invest a reasonable amount of time into understanding them.-->
 承诺是现代JavaScript开发的核心，强烈建议投入合理的时间来理解它们。

### Cleaner Syntax for Defining Object Literals

<!-- The module defining note related services currently exports an object with the properties <i>getAll</i>, <i>create</i>, and <i>update</i> that are assigned to functions for handling notes.-->
 定义笔记相关服务的模块目前导出了一个对象，其属性<i>getAll</i>、<i>create</i>和<i>update</i>被分配给处理笔记的函数。

<!-- The module definition was:-->
 该模块的定义是。

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
 该模块导出了以下看起来相当奇特的对象。

```js
{
  getAll: getAll,
  create: create,
  update: update
}
```

<!-- The labels to the left of the colon in the object definition are the <i>keys</i> of the object, whereas the ones to the right of it are <i>variables</i> that are defined inside of the module.-->
 对象定义中冒号左边的标签是对象的<i>键</i>，而它右边的是在模块中定义的<i>变量</i>。

<!-- Since the names of the keys and the assigned variables are the same, we can write the object definition with a more compact syntax:-->
 由于键的名字和分配的变量是一样的，我们可以用更紧凑的语法来写对象定义。

```js
{
  getAll,
  create,
  update
}
```

<!-- As a result, the module definition gets simplified into the following form:-->
 因此，模块定义被简化为以下形式。

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
 在使用这种更短的符号定义对象时，我们利用了一个[新特性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions)，它是通过ES6引入到JavaScript的，使得使用变量定义对象的方式稍微紧凑一些。

<!-- To demonstrate this feature, let's consider a situation where we have the following values assigned to variables:-->
 为了演示这个特性，让我们考虑这样一种情况：我们给变量分配了以下的值。

```js
const name = 'Leevi'
const age = 0
```

<!-- In older versions of JavaScript we had to define an object like this:-->
 在旧版本的JavaScript中，我们必须这样定义一个对象。

```js
const person = {
  name: name,
  age: age
}
```

<!-- However, since both the property fields and the variable names in the object are the same, it's enough to simply write the following in ES6 JavaScript:-->
 然而，由于对象中的属性字段和变量名称都是一样的，所以只需在ES6 JavaScript中写下以下内容即可。

```js
const person = { name, age }
```

<!-- The result is identical for both expressions. They both create an object with a <i>name</i> property with the value <i>Leevi</i> and an <i>age</i> property with the value <i>0</i>.-->
 两个表达式的结果都是一样的。它们都创建了一个对象，其<i>name</i>属性值为<i>Leevi</i>，<i>age</i>属性值为<i>0</i>。

### Promises and Errors

<!-- If our application allowed users to delete notes, we could end up in a situation where a user tries to change the importance of a note that has already been deleted from the system.-->
 如果我们的应用允许用户删除笔记，我们可能会出现这样的情况：用户试图改变一个已经被系统删除的笔记的重要性。

<!-- Let's simulate this situation by making the <em>getAll</em> function of the note service return a "hardcoded" note that does not actually exist on the backend server:-->
 让我们模拟这种情况，让笔记服务的<em>getAll</em>函数返回一个 "硬编码 "的笔记，这个笔记在后端服务器上实际上并不存在。

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}
```

<!-- When we try to change the importance of the hardcoded note, we see the following error message in the console. The error says that the backend server responded to our HTTP PUT request with a status code 404 <i>not found</i>.-->
 当我们试图改变这个硬编码笔记的重要性时，我们在控制台看到以下错误信息。该错误说，后端服务器响应我们的HTTP PUT请求时，状态代码为404 <i>未找到</i>。

![](../../images/2/23e.png)

<!-- The application should be able to handle these types of error situations gracefully. Users won't be able to tell that an error has actually occurred unless they happen to have their console open. The only way the error can be seen  in the application is that clicking the button has no effect on the importance of the note.-->
 应用应该能够优雅地处理这些类型的错误情况。除非用户碰巧打开了他们的控制台，否则他们无法知道错误确实发生了。在应用中可以看到错误的唯一方法是，点击按钮对注释的重要性没有影响。

<!-- We had [previously](/en/part2/getting_data_from_server#axios-and-promises) mentioned that a promise can be in one of three different states. When an HTTP request fails, the associated promise is <i>rejected</i>. Our current code does not handle this rejection in any way.-->
 我们[之前](/en/part2/getting_data_from_server#axios-and-promises)提到，一个承诺可以处于三种不同的状态之一。当一个HTTP请求失败时，相关的承诺会被<i>拒绝</i>。我们目前的代码没有以任何方式处理这种拒绝。

<!-- The rejection of a promise is [handled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) by providing the <em>then</em> method with a second callback function, which is called in the situation where the promise is rejected.-->
 拒绝承诺是通过提供带有第二个回调函数的<em>then</em>方法来[处理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)的，该函数在承诺被拒绝的情况下被调用。

<!-- The more common way of adding a handler for rejected promises is to use the [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method.-->
 为被拒绝的承诺添加处理程序的更常见方式是使用[catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)方法。

<!-- In practice, the error handler for rejected promises is defined like this:-->
 在实践中，被拒绝的承诺的错误处理程序是这样定义的。

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
 如果请求失败，与<em>catch</em>方法注册的事件处理程序被调用。

<!-- The <em>catch</em> method is often utilized by placing it deeper within the promise chain.-->
 <em>catch</em>方法经常被利用，将其置于承诺链的更深处。

<!-- When our application makes an HTTP request, we are in fact creating a [promise chain](https://javascript.info/promise-chaining):-->
 当我们的应用发出一个HTTP请求时，我们实际上是在创建一个[承诺链](https://javascript.info/promise-chaining)。

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then(response => response.data)
  .then(changedNote => {
    // ...
  })
```

<!-- The <em>catch</em> method can be used to define a handler function at the end of a promise chain, which is called once any promise in the chain throws an error and the promise becomes <i>rejected</i>.-->
 <em>catch</em>方法可以用来在承诺链的末端定义一个处理函数，一旦承诺链中的任何一个承诺抛出错误，承诺就会被调用，成为<i>拒绝</i>。

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

<!-- Let's use this feature and register an error handler in the <i>App</i> component:-->
 让我们使用这个功能，在<i>App</i>组件中注册一个错误处理程序。

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
 错误信息会通过可靠的老式[警报](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)对话框弹出显示给用户，并且删除的笔记会从状态中被过滤掉。

<!-- Removing an already deleted note from the application's state is done with the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method, which returns a new array comprising only of the items from the list for which the function that was passed as a parameter returns true for:-->
 从应用的状态中删除一个已经删除的笔记是通过数组[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)方法完成的，它返回一个新的数组，该数组只包括列表中的项目，而这个项目被作为参数传递的函数返回为真。

```js
notes.filter(n => n.id !== id)
```

<!-- It's probably not a good idea to use alert in more serious React applications. We will soon learn a more advanced way of displaying messages and notifications to users. There are situations, however, where a simple, battle-tested method like <em>alert</em> can function as a starting point. A more advanced method could always be added in later, given that there's time and energy for it.-->
 在更严肃的React应用中，使用alert可能不是一个好主意。我们很快就会学到一种更高级的向用户显示消息和通知的方法。然而，在有些情况下，像<em>alert</em>这样简单的、经过实践检验的方法可以作为一个起点。如果有时间和精力的话，更高级的方法可以在以后添加进去。

<!-- The code for the current state of our application can be found in the  <i>part2-6</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-6).-->
 我们的应用的当前状态的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-6)的<i>part2-6</i>分支中找到。

</div>

<div class="tasks">

<h3>Exercises 2.15.-2.18.</h3>

<h4>2.15: Phonebook step7</h4>

<!-- Let's return to our phonebook application.-->
 让我们回到我们的电话簿应用。

<!-- Currently, the numbers that are added to the phonebook are not saved to a backend server. Fix this situation.-->
 目前，添加到电话簿的号码没有被保存到后台服务器。修复这种情况。

<h4>2.16: Phonebook step8</h4>

<!-- Extract the code that handles the communication with the backend into its own module by following the example shown earlier in this part of the course material.-->
 按照本章节教材前面的例子，将处理与后端通信的代码提取到自己的模块中。

<h4>2.17: Phonebook step9</h4>

<!-- Make it possible for users to delete entries from the phonebook. The deletion can be done through a dedicated button for each person in the phonebook list. You can confirm the action from the user by using the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) method:-->
 使用户有可能从电话簿中删除条目。删除可以通过电话簿列表中每个人的专用按钮来完成。你可以通过使用[window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)方法来确认用户的操作。

![](../../images/2/24e.png)

<!-- The associated resource for a person in the backend can be deleted by making an HTTP DELETE request to the resource's URL. If we are deleting e.g. a person who has the <i>id</i> 2, we would have to make an HTTP DELETE request to the URL <i>localhost:3001/persons/2</i>. No data is sent with the request.-->
 通过对资源的URL进行HTTP DELETE请求，可以删除后端中某人的相关资源。例如，如果我们要删除一个拥有<i>id</i> 2的人，我们必须向URL <i>localhost:3001/persons/2</i>发出HTTP DELETE请求。该请求没有发送任何数据。

<!-- You can make an HTTP DELETE request with the [axios](https://github.com/axios/axios) library in the same way that we make all of the other requests.-->
 你可以用[axios](https://github.com/axios/axios)库做一个HTTP DELETE请求，和我们做其他请求的方式一样。

<!-- **NB:** You can't use the name <em>delete</em> for a variable because it's a reserved word in JavaScript. E.g. the following is not possible:-->
 **NB:** 你不能为一个变量使用<em>delete</em>这个名字，因为它是JavaScript中的一个保留词。例如，下面的情况是不可能的。

```js
// use some other name for variable!
const delete = (id) => {
  // ...
}
```

<h4>2.18*: Phonebook step10</h4>

<!-- Change the functionality so that if a number is added to an already existing user, the new number will replace the old number. It's recommended to use the HTTP PUT method for updating the phone number.-->
 改变功能，如果一个数字被添加到一个已经存在的用户，新的数字将取代旧的数字。建议使用HTTP PUT方法来更新电话号码。

<!-- If the person's information is already in the phonebook, the application can confirm the action from the user:-->
 如果这个人的信息已经在电话簿中，应用可以从用户那里确认这个动作。

![](../../images/teht/16e.png)

</div>
