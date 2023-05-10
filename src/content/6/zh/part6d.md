---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: zh
---

<div class="content">

<!-- At the end of this part, we will look at a few more different ways to manage the state of an application.-->
在本部分的末尾，我们将看一些更多不同的方法来管理应用程序的状态。

<!-- Let's continue with the note application. We will focus on communication with the server. Let's start the application from scratch. The first version is as follows:-->
让我们继续使用笔记应用程序。我们将重点关注与服务器的通信。让我们从零开始应用程序。第一个版本如下：

```js
const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return(
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App
```

<!-- The initial code is on GitHub in the repository [https://github.com/fullstack-hy2020/query-notes](https://github.com/fullstack-hy2020/query-notes/tree/part6-0) in branch <i>part6-0</i>.-->
初始代码在GitHub上的存储库[https://github.com/fullstack-hy2020/query-notes](https://github.com/fullstack-hy2020/query-notes/tree/part6-0)中的分支<i>part6-0</i>中。

### Managing data on the server with the React Query library

<!-- We shall now use the [React Query](https://react-query-v3.tanstack.com/) library to store and manage data retrieved from the server.-->
我們現在將使用 [React Query](https://react-query-v3.tanstack.com/) 庫來儲存和管理從伺服器檢索的資料。

<!-- Install the library with the command-->
安装库使用命令：`pip install libraryname`

```bash
npm install react-query
```

<!-- A few additions to the file  <i>index.js</i> are needed to pass the library functions to the entire application:-->
文件<i>index.js</i>需要增加几项，以将库功能传递给整个应用程序：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query' // highlight-line

import App from './App'

const queryClient = new QueryClient() // highlight-line

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}> // highlight-line
    <App />
  </QueryClientProvider> // highlight-line
)
```

<!-- We can now retrieve the notes in the <i>App</i> component. The code expands as follows:-->
我们现在可以在<i>应用程序</i>组件中检索笔记。 代码展开如下：

```js
import { useQuery } from 'react-query'  // highlight-line
import axios from 'axios'  // highlight-line

const App = () => {
  // ...

   // highlight-start
  const result = useQuery(
    'notes',
    () => axios.get('http://localhost:3001/notes').then(res => res.data)
  )

  console.log(result)
  // highlight-end

  // highlight-start
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  // highlight-end

  const notes = result.data  // highlight-line

  return (
    // ...
  )
}
```

<!-- Retrieving data from the server is still done in the familiar way with the Axios <i>get</i> method. However, the Axios method call is now wrapped in a [query](https://tanstack.com/query/latest/docs/react/guides/queries) formed with the [useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery) function. The first parameter of the function call is a string <i>notes</i> which acts as a [key](https://tanstack.com/query/latest/docs/react/guides/query-keys)  to the query defined, i.e. the list of notes.-->
仍然可以用Axios的<i>get</i>方法以熟悉的方式从服务器检索数据。但是，Axios方法调用现在被包装在使用[useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery)函数形成的[query](https://tanstack.com/query/latest/docs/react/guides/queries)中。函数调用的第一个参数是一个字符串<i>notes</i>，它充当定义的查询（即笔记列表）的[key](https://tanstack.com/query/latest/docs/react/guides/query-keys)。

<!-- The return value of the <i>useQuery</i> function is an object that indicates the status of the query. The output to the console illustrates the situation:-->
<i>useQuery</i>函数的返回值是一个对象，用来指示查询的状态。控制台的输出说明了这种情况：

![browser devtools showing success status](../../images/6/60new.png)

<!-- That is, the first time the component is rendered, the query is still in <i>loading</i> state, i.e. the associated HTTP request is pending. At this stage, only the following is rendered:-->
那么，第一次渲染该组件时，查询仍处于<i>加载</i>状态，即关联的HTTP请求尚未完成。此时，仅呈现以下内容：

```html
<div>loading data...</div>
```

<!-- However, the HTTP request is completed so quickly that even the most astute will not be able to see the text. When the request is completed, the component is rendered again. The query is in the state <i>success</i> on the second rendering, and the field <i>data</i> of the query object contains the data returned by the request, i.e. the list of notes that is rendered on the screen.-->
然而，HTTP请求完成得如此之快，以至于即使是最精明的人也无法看到文本。当请求完成时，组件会再次渲染。在第二次渲染中，查询的状态为<i>成功</i>，查询对象的<i>数据</i>字段包含请求返回的数据，即在屏幕上渲染的笔记列表。

<!-- So the application retrieves data from the server and renders it on the screen without using the React hooks <i>useState</i> and <i>useEffect</i> used in chapters 2-5 at all. The data on the server is now entirely under the administration of the React Query library, and the application does not need the state defined with React''s <i>useState</i> hook at all!-->
因此，该应用程序不使用第2-5章中的React钩子<i>useState</i>和<i>useEffect</i>来从服务器检索数据并在屏幕上呈现它。服务器上的数据现在完全由React Query库管理，应用程序根本不需要使用React的<i>useState</i>钩子定义状态！

<!-- Let''s move the function making the actual HTTP request to its own file <i>requests.js</i>-->
让我们把实际的HTTP请求函数移动到它自己的文件<i>requests.js</i>中

```js
import axios from 'axios'

export const getNotes = () =>
  axios.get('http://localhost:3001/notes').then(res => res.data)
```

<!-- The <i>App</i> component is now slightly simplified-->
<i>App</i> 组件现在稍微简化了

```js
import { useQuery } from 'react-query'
import { getNotes } from './requests' // highlight-line

const App = () => {
  // ...

  const result = useQuery('notes', getNotes)  // highlight-line

  // ...
}
```

<!-- The current code for the application is in [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-1) in the branch <i>part6-1</i>.-->
当前应用程序的代码位于[GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-1)的<i>part6-1</i>分支中。

### Synchronizing data to the server using React Query

<!-- Data is already successfully retrieved from the server. Next, we will make sure that the added and modified data is stored on the server. Let''s start by adding new notes.-->
数据已经从服务器成功获取。接下来，我们将确保添加和修改的数据存储在服务器上。让我们从添加新笔记开始。

<!-- Let''s make a function <i>createNote</i> to the file <i>requests.js</i> for saving new notes:-->
在文件`requests.js`中新建一个函数`createNote`来保存新笔记：

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

export const getNotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createNote = newNote => // highlight-line
  axios.post(baseUrl, newNote).then(res => res.data) // highlight-line
```

<!-- The <i>App</i> component will change as follows-->
<i>App</i> 组件将如下所示改变

```js
import { useQuery, useMutation } from 'react-query' // highlight-line
import { getNotes, createNote } from './requests' // highlight-line

const App = () => {
  const newNoteMutation = useMutation(createNote) // highlight-line

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true }) // highlight-line
  }

  //

}
```

<!-- To create a new note, a [mutation](https://tanstack.com/query/latest/docs/react/guides/mutations) is defined using the function [useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation):-->
要创建一个新的笔记，可以使用函数[useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation)定义[mutation](https://tanstack.com/query/latest/docs/react/guides/mutations):

```js
const newNoteMutation = useMutation(createNote)
```

<!-- The parameter is the function we added to the file <i>requests.js</i>, which uses Axios to send a new note to the server.-->
参数是我们添加到文件<i>requests.js</i>中的函数，它使用Axios向服务器发送一个新的笔记。

<!-- The event handler <i>addNote</i> performs the mutation by calling the mutation object''s function <i>mutate</i> and passing the new note as a parameter:-->
事件处理程序<i>addNote</i>通过调用变异对象的函数<i>mutate</i>并传入新笔记作为参数来执行变异：

```js
newNoteMutation.mutate({ content, important: true })
```

<!-- Our solution is good. Except it doesn''t work. The new note is saved on the server, but it is not updated on the screen.-->
我們的解決方案很好。但它不起作用。新的筆記已保存在服務器上，但它沒有更新到屏幕上。

<!-- In order to render a new note as well, we need to tell React Query that the old result of the query whose key is the string <i>notes</i> should be [invalidated](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations).-->
为了渲染新的note，我们需要告诉React Query，其key为字符串<i>notes</i>的查询的旧结果应该[失效](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations)。

<!-- Fortunately, invalidation is easy, it can be done by defining the appropriate <i>onSuccess</i> callback function to the mutation:-->
幸运的是，无效化很容易，可以通过为变异定义适当的<i>onSuccess</i>回调函数来完成：

```js
import { useQuery, useMutation, useQueryClient } from 'react-query' // highlight-line
import { getNotes, createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient() // highlight-line

  const newNoteMutation = useMutation(createNote, {
    onSuccess: () => {  // highlight-line
      queryClient.invalidateQueries('notes')  // highlight-line
    },
  })

  // ...
}
```

<!-- Now that the mutation has been successfully executed, a function call is made to-->
the database.

现在突变已经成功执行，就向数据库发出了一个函数调用。

```js
queryClient.invalidateQueries('notes')
```

<!-- This in turn causes React Query to automatically update a query with the key <i>notes</i>, i.e. fetch the notes from the server. As a result, the application renders the up-to-date state on the server, i.e. the added note is also rendered.-->
这反过来导致React Query自动更新具有键<i>notes</i>的查询，即从服务器获取笔记。结果，应用程序在服务器上呈现最新状态，即也呈现添加的笔记。

<!-- Let us also implement the change in the importance of notes. A function for updating notes is added to the file <i>requests.js</i>:-->
让我们也实施对注释重要性的改变。一个用于更新注释的函数被添加到文件<i>requests.js</i>中：

```js
export const updateNote = updatedNote =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(res => res.data)
```

<!-- Updating the note is also done by mutation. The <i>App</i> component expands as follows:-->
更新笔记也是通过变异来完成的。<i>App</i>组件的扩展如下：

```js
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getNotes, createNote, updateNote } from './requests' // highlight-line

const App = () => {
  // ...

  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    },
  })

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
  }

  // ...
}
```

<!-- So again, a mutation was created that invalidated the query <i>notes</i> so that the updated note is rendered correctly. Using mutation is easy, the method <i>mutate</i> receives a note as a parameter, the importance of which has been changed to the negation of the old value.-->
所以再次，一個突變被創造出來，使查詢<i>筆記</i>無效，以便正確地呈現更新後的筆記。使用突變很容易，方法<i>突變</i>接收一個筆記作為參數，其重要性已被改為舊值的否定。

<!-- The current code for the application is in [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) in the branch <i>part6-2</i>.-->
当前应用程序的代码在[GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2)的<i>part6-2</i>分支上。

### Optimizing the performance

<!-- The application works well, and the code is relatively simple. The ease of making changes to the list of notes is particularly surprising. For example, when we change the importance of a note, invalidating the query <i>notes</i> is enough for the application data to be updated:-->
应用程序运行良好，代码相对简单。编辑笔记列表的便捷性尤为惊人。例如，当我们更改笔记的重要性时，只需要失效查询<i>notes</i>，应用程序数据就会更新：

```js
  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes') // highlight-line
    },
  })
```

<!-- The consequence of this, of course, is that after the PUT request that causes the note change, the application makes a new GET request to retrieve the query data from the server:-->
结果，当然，是在发出导致笔记更改的PUT请求后，应用程序又发出一个新的GET请求以从服务器检索查询数据：

![devtools network tab with highlight over 3 and notes requests](../../images/6/61new.png)

<!-- If the amount of data retrieved by the application is not large, it doesn't really matter. After all, from a browser-side functionality point of view, making an extra HTTP GET request doesn't really matter, but in some situations it might put a strain on the server.-->
如果应用程序检索的数据量不大，那么没有什么大不了的。毕竟，从浏览器功能的角度来看，发出额外的HTTP GET请求并不重要，但在某些情况下，可能会给服务器带来压力。

<!-- If necessary, it is also possible to optimize performance [by manually updating](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses) the query state maintained by React Query.-->
如果有必要，也可以通过[手动更新](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses)由React Query维护的查询状态来优化性能。

<!-- The change for the mutation adding a new note is as follows:-->
变异增加一个新备注的变化如下：

```js
const App = () => {
  const queryClient =  useQueryClient()

  const newNoteMutation = useMutation(createNote, {
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData('notes') // highlight-line
      queryClient.setQueryData('notes', notes.concat(newNote)) // highlight-line
    }
  })
  // ...
}
```

<!-- That is, in the <i>onSuccess</i> callback, the <i>queryClient</i> object first reads the existing <i>notes</i> state of the query and updates it by adding a new note, which is obtained as a parameter of the callback function. The value of the parameter is the value returned by the function <i>createNote</i>, defined in the file <i>requests.js</i> as follows:-->
那么，在<i>onSuccess</i>回调函数中，<i>queryClient</i>对象首先读取查询的现有<i>notes</i>状态，并通过添加回调函数参数中获得的新笔记来更新它，该参数的值是<i>requests.js</i>文件中定义的函数<i>createNote</i>返回的值：

```js
export const createNote = newNote =>
  axios.post(baseUrl, newNote).then(res => res.data)
```

<!-- It would be relatively easy to make a similar change to a mutation that changes the importance of the note, but we leave it as an optional exercise.-->
这很容易对一个突变做出类似的改变，以改变笔记的重要性，但我们把它作为一个可选的练习。

<!-- If we closely follow the browser''s network tab, we notice that React Query retrieves all notes as soon as we move the cursor to the input field:-->
如果我们仔细跟踪浏览器的网络标签，我们会注意到，只要我们将光标移动到输入字段，React Query 就会立即检索所有笔记。

![dev tools notes app with input text field highlighted and arrow on network over notes request as 200](../../images/6/62new.png)

<!-- What is going on? By reading the [documentation](https://tanstack.com/query/latest/docs/react/reference/useQuery), we notice that the default functionality of React Query's queries is that the queries (whose status is <i>stale</i>) are updated when <i>window focus</i>, i.e. the active element of the application's user interface, changes. If we want, we can turn off the functionality by creating a query as follows:-->
**问题是什么？** 通过阅读[文档](https://tanstack.com/query/latest/docs/react/reference/useQuery)，我们注意到React Query查询的默认功能是，当<i>窗口聚焦</i>，即应用程序的用户界面的活动元素发生变化时，更新状态<i>过时</i>的查询。如果需要，我们可以通过以下方式创建查询来关闭此功能：

```js
const App = () => {
  // ...
  const result = useQuery('notes', getNotes, {
    refetchOnWindowFocus: false  // highlight-line
  })

  // ...
}
```

<!-- If you put a console.log statement to the code, you can see from browser console how often React Query causes the application to be re-rendered. The rule of thumb is that rerendering happens at least whenever there is a need for it, i.e. when the state of the query changes. You can read more about it e.g. [here](https://tkdodo.eu/blog/react-query-render-optimizations).-->
如果你把一个`console.log`语句放到代码中，你可以从浏览器控制台看到React Query有多经经常导致应用重新渲染。经验法则是，只要有需要，比如当查询状态发生变化时，就会重新渲染。你可以在[这里](https://tkdodo.eu/blog/react-query-render-optimizations)了解更多有关它的信息。

<!-- The code for the application is in [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) in the branch <i>part6-3</i>.-->
代码在[GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3)的<i>part6-3</i>分支上。

<!-- React Query is a versatile library that, based on what we have already seen, simplifies the application. Does React Query make more complex state management solutions such as Redux unnecessary? No. React Query can partially replace the state of the application in some cases, but as the [documentation](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state) states-->
, React Query is not a replacement for client state management solutions such as Redux.

React Query 是一个多功能的库，根据我们已经看到的，可以简化应用程序。 React Query 会使得更复杂的状态管理解决方案（如 Redux）变得不必要吗？不会。 React Query 可以在某些情况下部分替代应用程序的状态，但是正如[文档](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state)所述，React Query 不是客户端状态管理解决方案（如 Redux）的替代品。

<!-- - React Query is a <i>server-state library</i>, responsible for managing asynchronous operations between your server and client-->
.

React Query 是一个<i>服务器状态库</i>，负责管理服务器和客户端之间的异步操作。
<!-- - Redux, etc. are <i>client-state libraries</i> that can be used to store asynchronous data, albeit inefficiently when compared to a tool like React Query-->
.

Redux 等是<i>客户端状态库</i>，可用于存储异步数据，尽管与 React Query 等工具相比效率较低。

<!-- So React Query is a library that maintains the <i>server state</i> in the frontend, i.e. acts as a cache for what is stored on the server. React Query simplifies the processing of data on the server, and can in some cases eliminate the need for data on the server to be saved in the frontend state.-->
所以React Query是一个库，它在前端维护<i>服务器状态</i>，即充当服务器上存储的缓存。 React Query简化了服务器上的数据处理，并且在某些情况下可以消除服务器上的数据存储在前端状态中的需要。

<!-- Most React applications need not only a way to temporarily store the served data, but also some solution for how the rest of the frontend state (e.g. the state of forms or notifications) is handled.-->
大多数React应用程序不仅需要一种临时存储已提供数据的方式，还需要一些解决方案来处理前端状态（例如表单或通知的状态）。

</div>

<div class="tasks">

### Exercises 6.20.-6.22.

<!-- Now let''s make a new version of the anecdote application that uses the React Query library. Take [this project](https://github.com/fullstack-hy2020/query-anecdotes) as your starting point. The project has a ready-installed JSON Server, the operation of which has been slightly modified. Start the server with <i>npm run server</i>.-->
现在让我们制作一个使用React Query库的新版本的轶事应用程序。以[此项目](https://github.com/fullstack-hy2020/query-anecdotes)为起点。该项目已经安装了一个JSON服务器，其操作已经稍微修改过。使用<i>npm run server</i>启动服务器。

#### Exercise 6.20

<!-- Implement retrieving anecdotes from the server using React Query.-->
实施使用React Query从服务器检索轶事。

<!-- The application should work in such a way that if there are problems communicating with the server, only an error page will be displayed:-->
应用程序应当以这样的方式工作：如果与服务器通信存在问题，只会显示一个错误页面：

![browser saying anecdote service not available due to problems in server on localhost](../../images/6/65new.png)

<!-- You can find [here](https://tanstack.com/query/latest/docs/react/guides/queries) info how to detect the possible errors.-->
你可以[在这里](https://tanstack.com/query/latest/docs/react/guides/queries)找到如何检测可能出错的信息。

<!-- You can simulate a problem with the server by e.g. turning off the JSON Server. Please note that in a problem situation, the query is first in the state <i>isLoading</i> for a while, because if a request fails, React Query tries the request a few times before it states that the request is not successful. You can optionally specify that no retries are made:-->
你可以通过例如关闭JSON服务器来模拟服务器问题。请注意，在出现问题的情况下，查询首先处于<i>isLoading</i>状态，因为如果请求失败，React Query会在声明请求失败之前尝试请求几次。您可以选择不重试：

```js
const result = useQuery(
  'anecdotes', getAnecdotes,
  {
    retry: false
  }
)
```

<!-- or that the request is retried e.g. only once:-->
或者请求只重试一次：

```js
const result = useQuery(
  'anecdotes', getAnecdotes,
  {
    retry: 1
  }
)
```

#### Exercise 6.21

<!-- Implement adding new anecdotes to the server using React Query. The application should render a new anecdote by default. Note that the content of the anecdote must be at least 5 characters long, otherwise the server will reject the POST request. You don''t have to worry about error handling now.-->
实现使用 React Query 添加新轶事到服务器。应用程序默认应该渲染一个新的轶事。请注意，轶事的内容必须至少有 5 个字符长，否则服务器会拒绝 POST 请求。现在你不必担心错误处理。

#### Exercise 6.22

<!-- Implement voting for anecdotes using again the React Query. The application should automatically render the increased number of votes for the voted anecdote.-->
实施使用React Query对轶事的投票。应用程序应自动渲染投票轶事的增加票数。

</div>

<div class="content">

### useReducer

<!-- So even if the application uses React Query, some kind of solution is usually needed to manage the rest of the frontend state (for example, the state of forms). Quite often, the state created with <i>useState</i> is a sufficient solution. Using Redux is of course possible, but there are other alternatives.-->
即使应用程序使用React Query，通常还需要某种解决方案来管理剩余的前端状态（例如表单的状态）。通常，使用<i>useState</i>创建的状态就足够了。当然可以使用Redux，但也有其他选择。

<!-- Let''s look at a simple counter application. The application displays the counter value, and offers three buttons to update the counter status:-->
让我们来看一个简单的计数器应用程序。该应用程序显示计数器值，并提供三个按钮来更新计数器状态：

![browser showing + - 0 buttons and 7 above](../../images/6/63new.png)

<!-- We shall now implement the counter state management using a Redux-like state management mechanism provided by React''s built-in [useReducer](https://beta.reactjs.org/reference/react/useReducer) hook. Code looks like the following:-->
我们现在将使用React内置的[useReducer](https://beta.reactjs.org/reference/react/useReducer)钩子提供的类似Redux的状态管理机制来实现计数器状态管理。代码如下：

```js
import { useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={() => counterDispatch({ type: "INC"})}>+</button>
        <button onClick={() => counterDispatch({ type: "DEC"})}>-</button>
        <button onClick={() => counterDispatch({ type: "ZERO"})}>0</button>
      </div>
    </div>
  )
}

export default App
```

<!-- The hook [useReducer](https://beta.reactjs.org/reference/react/useReducer) provides a mechanism to create a state for an application. The parameter for creating a state is the reducer function that handles state changes, and the initial value of the state:-->
[`useReducer`](https://beta.reactjs.org/reference/react/useReducer) 钩子提供了一种机制来为应用程序创建状态。创建状态的参数是处理状态更改的 reducer 函数，以及状态的初始值：

```js
const [counter, counterDispatch] = useReducer(counterReducer, 0)
```

<!-- The reducer function that handles state changes is similar to Redux''s reducers, i.e. the function gets as parameters the current state and the action that changes the state. The function returns the new state updated based on the type and possible contents of the action:-->
reducer函数处理状态更改与Redux的reducers类似，即函数作为参数获取当前状态和更改状态的动作。该函数根据动作的类型和可能的内容返回更新后的新状态：

```js
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}
```

<!-- In our example, actions have nothing but a type. If the action's type is <i>INC</i>, it increases the value of the counter by one, etc. Like Redux's reducers, actions can also contain arbitrary data, which is usually put in the action''s <i>payload</i> field.-->
在我们的示例中，行动除了一种类型外没有其他。如果行动的类型是<i>INC</i>，它会增加计数器的值1等等。就像Redux的reducers一样，行动也可以包含任意数据，通常放在行动的<i>payload</i>字段中。

<!-- The function <i>useReducer</i> returns an array that contains an element to access the current value of the state (first element of the array), and a <i>dispatch</i> function (second element of the array) to change the state:-->
<i>useReducer</i> 返回一个数组，其中第一个元素可以访问当前状态的值，第二个元素是<i>dispatch</i>函数，用于改变状态：

```js
const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)  // highlight-line

  return (
    <div>
      <div>{counter}</div> // highlight-line
      <div>
        <button onClick={() => counterDispatch({ type: "INC" })}>+</button> // highlight-line
        <button onClick={() => counterDispatch({ type: "DEC" })}>-</button>
        <button onClick={() => counterDispatch({ type: "ZERO" })}>0</button>
      </div>
    </div>
  )
}
```

<!-- As can be seen the state change is done exactly as in Redux, the dispatch function is given the appropriate state-changing action as a parameter:-->
正如可以看到的，状态更改与Redux完全一样，dispatch函数被给予适当的更改状态的动作作为参数：

```js
counterDispatch({ type: "INC" })
```

<!-- The current code for the application is in the repository [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) in the branch <i>part6-1</i>.-->
当前应用程序的代码在仓库 [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) 的 <i>part6-1</i> 分支中。

### Using context for passing the state to components

<!-- If we want to split the application into several components, the value of the counter and the dispatch function used to manage it must also be passed to the other components. One solution would be to pass these as props in the usual way:-->
如果我们想要将应用程序分割成几个组件，用于管理它的计数器的值和调度函数也必须传递给其他组件。一种解决方案是以通常的方式将这些作为props传递：

```js
const Display = ({ counter }) => {
  return <div>{counter}</div>
}

const Button = ({ dispatch, type, label }) => {
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <div>
        // highlight-start
        <Button dispatch={counterDispatch} type='INC' label='+' />
        <Button dispatch={counterDispatch} type='DEC' label='-' />
        <Button dispatch={counterDispatch} type='ZERO' label='0' />
        // highlight-end
      </div>
    </div>
  )
}
```

<!-- The solution works, but is not optimal. If the component structure gets complicated, e.g. the dispatcher should be forwarded using props through many components to the components that need it, even though the components in between in the component tree do not need the dispatcher. This phenomenon is called <i>prop drilling</i>.-->
解决方案可行，但不是最优的。如果组件结构变得复杂，例如分发器应该通过props转发到需要它的组件，即使中间组件树中的组件不需要分发器。这种现象被称为<i>prop drilling</i>。

<!-- React's built-in [Context API](https://beta.reactjs.org/learn/passing-data-deeply-with-context) provides a solution for us. React's context is a kind of global state of the application, to which it is possible to give direct access to any component app.-->
React 的内置[Context API](https://beta.reactjs.org/learn/passing-data-deeply-with-context) 为我们提供了解决方案。React 的上下文是应用程序的全局状态，可以直接访问任何组件应用程序。

<!-- Let us now create a context in the application that stores the state management of the counter.-->
让我们现在在应用程序中创建一个上下文，用于存储计数器的状态管理。

<!-- The context is created with React's hook [createContext](https://beta.reactjs.org/reference/react/createContext). Let's create a context in the file <i>CounterContext.js</i>:-->
在文件<i>CounterContext.js</i>中，使用 React 的钩子[createContext](https://beta.reactjs.org/reference/react/createContext)创建上下文：

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

<!-- The <i>App</i> component can now <i>provide</i> a context to its child components as follows:-->
<i>App</i> 组件现在可以如下提供上下文给其子组件：

```js
import CounterContext from './CounterContext' // highlight-line

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch]}>  // highlight-line
      <Display counter={counter}/>
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </CounterContext.Provider> // highlight-line
  )
}
```

<!-- As can be seen, providing the context is done by wrapping the child components inside the <i>CounterContext.Provider</i> component and setting a suitable value for the context.-->
可以看出，提供上下文是通过将子组件包装在<i>CounterContext.Provider</i>组件中并为上下文设置合适的值来完成的。

<!-- The context value is now set to be an array containing the value of the counter, and the <i>dispatch</i> function.-->
现在将上下文值设置为包含计数器值和<i>dispatch</i>函数的数组。

<!-- Other components now access the context using the [useContext](https://beta.reactjs.org/reference/react/useContext) hook:-->
其他组件现在使用[useContext](https://beta.reactjs.org/reference/react/useContext)钩子访问上下文：

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext'

const Display = () => {
  const [counter, dispatch] = useContext(CounterContext) // highlight-line
  return <div>
    {counter}
  </div>
}

const Button = ({ type, label }) => {
  const [counter, dispatch] = useContext(CounterContext) // highlight-line
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}
```

<!-- The current code for the application is in [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) in the branch <i>part6-2</i>.-->
当前应用程序的代码位于 [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) 的 <i>part6-2</i> 分支中。

### Defining the counter context in a separate file

<!-- Our application has an annoying feature, that the functionality of the counter state management is partly defined in the <i>App</i> component. Now let''s move everything related to the counter to <i>CounterContext.js</i>:-->
我们的应用有一个令人讨厌的特性，即计数器状态管理的功能部分定义在<i>App</i>组件中。现在让我们将与计数器相关的一切移动到<i>CounterContext.js</i>：

```js
import { createContext, useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const CounterContext = createContext()

export const CounterContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch] }>
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext
```

<!-- The file now exports, in addition to the <i>CounterContext</i> object corresponding to the context, the <i>CounterContextProvider</i> component, which is practically a context provider whose value is a counter and a dispatcher used for its state management.-->
文件现在除了对应于上下文的<i>CounterContext</i>对象外，还导出了<i>CounterContextProvider</i>组件，它实质上是一个上下文提供者，其值是一个计数器和一个用于管理其状态的调度程序。

<!-- Let''s enable the context provider by making a change in <i>index.js</i>:-->
让我们通过在<i>index.js</i>中做出更改来启用上下文提供者：

```js
import ReactDOM from 'react-dom/client'
import App from './App'
import { CounterContextProvider } from './CounterContext' // highlight-line

ReactDOM.createRoot(document.getElementById('root')).render(
  <CounterContextProvider>  // highlight-line
    <App />
  </CounterContextProvider>  // highlight-line
)
```

<!-- Now the context defining the value and functionality of the counter is available to <i>all</i> components of the application.-->
现在，定义计数器价值和功能的上下文可供<i>所有</i>应用程序组件使用。

<!-- The <i>App</i> component is simplified to the following form:-->
<i>App</i> 组件简化为以下形式：

```js
import Display from './components/Display'
import Button from './components/Button'

const App = () => {
  return (
    <div>
      <Display />
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </div>
  )
}

export default App
```

<!-- The context is still used in the same way, e.g. the component <i>Button</i> is defined as follows:-->
context 还是以相同的方式使用，例如 <i>Button</i> 组件定义如下：

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Button = ({ type, label }) => {
  const [counter, dispatch] = useContext(CounterContext)
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

<!-- The <i>Button</i> component only needs the <i>dispatch</i> function of the counter, but it also gets the value of the counter from the context using the function <i>useContext</i>:-->
<i>按钮</i>组件只需要计数器的<i>dispatch</i>函数，但它还可以使用<i>useContext</i>函数从上下文中获取计数器的值：

```js
  const [counter, dispatch] = useContext(CounterContext)
```

<!-- This is not a big problem, but it is possible to make the code a bit more pleasant and expressive by defining a couple of helper functions in the <i>CounterContext</i> file:-->
这不是一个大问题，但我们可以通过在<i>CounterContext</i>文件中定义一些辅助函数来使代码更加容易理解和表达：

```js
import { createContext, useReducer, useContext } from 'react' // highlight-line

const CounterContext = createContext()

// ...

export const useCounterValue = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[0]
}

export const useCounterDispatch = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[1]
}

// ...
```

<!-- With the help of these helper functions, it is possible for the components that use the context to get hold of the part of the context that they need. The <i>Display</i> component changes as follows:-->
随着这些辅助函数的帮助，使用上下文的组件可以获得他们需要的上下文的部分。<i>显示</i>组件如下所示改变：

```js
import { useCounterValue } from '../CounterContext' // highlight-line

const Display = () => {
  const counter = useCounterValue() // highlight-line
  return <div>
    {counter}
  </div>
}


export default Display
```

<!-- Component <i>Button</i> becomes:-->
<i>按钮</i>

```js
import { useCounterDispatch } from '../CounterContext' // highlight-line

const Button = ({ type, label }) => {
  const dispatch = useCounterDispatch() // highlight-line
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

<!-- The solution is quite elegant. The entire state of the application, i.e. the value of the counter and the code for managing it, is now isolated in the file <i>CounterContext</i>, which provides components with well-named and easy-to-use auxiliary functions for managing the state.-->
解决方案相当优雅。应用程序的整个状态，即计数器的值和管理它的代码，现在都被隔离在文件<i>CounterContext</i>中，它为组件提供了命名良好且易于使用的辅助功能来管理状态。

<!-- The final code for the application is in [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3) in the branch <i>part6-3</i>.-->
最终的应用代码在[GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3)的<i>part6-3</i>分支中。

<!-- As a technical detail, it should be noted that the helper functions <i>useCounterValue</i> and <i>useCounterDispatch</i> are defined as [custom hooks](https://reactjs.org/docs/hooks-custom.html), because calling the hook function <i>useContext</i> is [possible](https://reactjs.org/docs/hooks -rules.html) only from React components or custom hooks. Custom hooks are JavaScript functions whose name must start with the string _use_. We will return to custom hooks in a little more detail in [part 7](/en/part7/custom_hooks) of the course.-->
作为技术细节，应该指出辅助函数<i>useCounterValue</i>和<i>useCounterDispatch</i>被定义为[自定义钩子](https://reactjs.org/docs/hooks-custom.html)，因为只有从React组件或自定义钩子中才能调用钩子函数<i>useContext</i>。[规则](https://reactjs.org/docs/hooks-rules.html)。自定义钩子是JavaScript函数，其名称必须以字符串_use_开头。我们将在课程的[第七部分](/en/part7/custom_hooks)中更详细地回顾自定义钩子。

</div>

<div class="tasks">

### Exercises 6.23.-6.24.

#### Exercise 6.23.

<!-- The application has a <i>Notification</i> component for displaying notifications to the user.-->
应用程序具有<i>通知</i>组件，用于向用户显示通知。

<!-- Implement the application''s notification state management using the useReducer hook and context. The notification should tell the user when a new anecdote is created or an anecdote is voted on:-->
使用useReducer hook和context来实现应用程序的通知状态管理。通知应告知用户当新的轶事被创建或轶事被投票时：

![browser showing notification for added anecdote](../../images/6/66new.png)

<!-- The notification is displayed for five seconds.-->
通知会显示五秒钟。

#### Exercise 6.24.

<!-- As stated in exercise 6.21, the server requires that the content of the anecdote to be added is at least 5 characters long. Now implement error handling for the insertion. In practice, it is sufficient to display a notification to the user in case of a failed POST request:-->
根據第6.21題所述，服務器要求新增的anecdote內容至少要有5個字符。現在對新增操作加入錯誤處理。在實踐中，只要在POST請求失敗時向用戶顯示提示即可：

![browser showing error notification for trying to add too short of an anecdoate](../../images/6/67new.png)

<!-- The error condition should be handled in the callback function registered for it, see-->
the example below

在为它注册的回调函数中应该处理错误条件，参见下面的示例。
<!-- [here](https://tanstack.com/query/latest/docs/react/reference/useMutation) how to register a function.-->
[如何注册一个函数](https://tanstack.com/query/latest/docs/react/reference/useMutation)

使用`useMutation`函数可以注册一个函数，该函数将返回一个`MutationFunction`，该函数可以用来执行与特定操作相关的变更操作。它还可以接受一个可选的参数，用于指定变更操作的参数。

<!-- This was the last exercise for this part of the course and it''s time to push your code to GitHub and mark all of your completed exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本部分课程的最后一个练习，是时候把你的代码推送到GitHub，并将所有完成的练习提交到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)了。

</div>

<div class="content">

### Which state management solution to choose?

<!-- In chapters 1-5, all state management of the application was done using React''s hook <i>useState</i>. Asynchronous calls to the backend required the use of the <i>useEffect</i> hook in some situations. In principle, nothing else is needed.-->
在第1-5章中，所有应用程序的状态管理都使用React的hook <i>useState</i> 完成。 在某些情况下，需要使用<i>useEffect</i> hook来执行对后端的异步调用。 原则上，不需要其他任何东西。

<!-- A subtle problem with a solution based on a state created with the <i>useState</i> hook is that if some part of the application''s state is needed by multiple components of the application, the state and the functions for manipulating it must be passed via props to all components that handle the state. Sometimes props need to be passed through multiple components, and the components along the way may not even be interested in the state in any way. This somewhat unpleasant phenomenon is called <i>prop drilling</i>.-->
一个基于<i>useState</i>钩子创建的状态的微妙问题是，如果应用程序的某些状态被多个组件所需，则必须通过props将状态和操纵它的函数传递给处理状态的所有组件。有时候props需要通过多个组件传递，而沿途的组件甚至可能对状态没有任何兴趣。这种有些不愉快的现象被称为<i>prop drilling</i>。

<!-- Over the years, several alternative solutions have been developed for state management of React applications, which can be used to ease problematic situations (e.g. prop drilling). However, no solution has been "final", all have their own pros and cons, and new solutions are being developed all the time.-->
过去几年来，为React应用程序的状态管理开发了几种替代解决方案，可用于缓解有问题的情况（例如prop drilling）。然而，没有解决方案是“最终的”，所有方案都有自己的优缺点，而且不断开发新的解决方案。

<!-- The situation may confuse a beginner and even an experienced web developer. Which solution should be used?-->
情况可能会使初学者甚至经验丰富的网络开发者感到困惑。应该使用哪种解决方案？

<!-- For a simple application, <i>useState</i> is certainly a good starting point. If the application is communicating with the server, the communication can be handled in the same way as in chapters 1-5, using the state of the application itself. Recently, however, it has become more common to move the communication and associated state management at least partially under the control of React Query (or some other similar library). If you are concerned about useState and the prop drilling it entails, using context may be a good option. There are also situations where it may make sense to handle some of the state with useState and some with contexts.-->
对于一个简单的应用程序，<i>useState</i>当然是一个很好的起点。如果应用程序与服务器进行通信，可以像第1-5章中一样使用应用程序本身的状态来处理通信。然而，最近，将通信和相关的状态管理至少部分地移动到React Query（或其他类似的库）的控制之下变得更加普遍。如果您担心使用State和它所带来的道具钻孔，使用上下文可能是一个很好的选择。也有一些情况下，使用一些状态使用State和一些使用上下文可能是有意义的。

<!-- The most comprehensive and robust state management solution is Redux, which is a way to implement the so-called [Flux](https://facebookarchive.github.io/flux/) architecture. Redux is slightly older than the solutions presented in this section. The rigidity of Redux has been the motivation for many new state management solutions, such as React's <i>useReducer</i>. Some of the criticisms of Redux's rigidity have already become obsolete thanks to the [Redux Toolkit](https://redux-toolkit.js.org/).-->
最全面、最健壮的状态管理解决方案是Redux，它是实现所谓的[Flux](https://facebookarchive.github.io/flux/)架构的一种方式。Redux比本节中介绍的解决方案略微早些。Redux的僵化一直是许多新的状态管理解决方案的动力，比如React的<i>useReducer</i>。由于[Redux Toolkit](https://redux-toolkit.js.org/)的出现，一些对Redux僵化的批评已经成为过去。

<!-- Over the years, there have also been other state management libraries developed that are similar to Redux, such as the newer entrant [Recoil](https://recoiljs.org/) and the slightly older [MobX](https://mobx.js.org/). However, according to [Npm trends](https://npmtrends.com/mobx-vs-recoil-vs-redux), Redux still clearly dominates, and in fact seems to be increasing its lead:-->
随着时间的推移，也有其他类似于 Redux 的状态管理库被开发出来，比如新进者[Recoil](https://recoiljs.org/)和稍微老一点的[MobX](https://mobx.js.org/)。然而，根据[Npm trends](https://npmtrends.com/mobx-vs-recoil-vs-redux)，Redux 仍然明显占据着主导地位，而且实际上似乎还在增加其优势：

![graph showing redux growing in popularity over past 5 years](../../images/6/64new.png)

<!-- Also, Redux does not have to be used in its entirety in an application. It may make sense, for example, to manage the form state outside of Redux, especially in situations where the state of a form does not affect the rest of the application. It is also perfectly possible to use Redux and React Query together in the same application.-->
此外，Redux不必在应用程序中完全使用。例如，在表单状态不会影响应用程序其余部分的情况下，可能有意义将表单状态管理在Redux之外。同样，在同一应用程序中也可以很完美地使用Redux和React Query。

<!-- The question of which state management solution should be used is not at all straightforward. It is impossible to give a single correct answer. It is also likely that the selected state management solution may turn out to be suboptimal as the application grows to such an extent that the solution have to be changed even if the application has already been put into production use.-->
问题是应该使用哪种状态管理解决方案并不是一件容易的事。无法给出单一正确的答案。而且，随着应用程序的发展，即使应用程序已经投入使用，选择的状态管理解决方案也可能是次优的。

</div>
