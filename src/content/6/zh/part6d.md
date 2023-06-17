---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: zh
---

<div class="content">
<!--At the end of this part, we will look at a few more different ways to manage the state of an application.-->

在本章结束，我们将会了解几种管理应用状态的不同方式。

<!--Let's continue with the note application. We will focus on communication with the server. Let's start the application from scratch. The first version is as follows:-->

我们继续回到 note 应用。这次我们将关注与服务器的通信。我们从头开始打造应用，它的第一版如下：

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

<!--The initial code is on GitHub in the repository [https://github.com/fullstack-hy2020/query-notes](https://github.com/fullstack-hy2020/query-notes/tree/part6-0) in branch <i>part6-0</i>.-->

初始代码可以在 GitHub 仓库 [https://github.com/fullstack-hy2020/query-notes](https://github.com/fullstack-hy2020/query-notes/tree/part6-0) 中 <i>part6-0</i> 的分支中找到.

### <!--Managing data on the server with the React Query library-->

### 利用 React Query 管理服务器端数据

<!--We shall now use the [React Query](https://tanstack.com/query/latest/docs/react/) library to store and manage data retrieved from the server.--> 

我们现在将用 [React Query](https://tanstack.com/query/latest/docs/react/) 存储并管理从服务器检索的数据。

<!--Install the library with the command-->

用以下命令安装 React Query 库：

```bash
npm install react-query
```

<!--A few additions to the file  <i>index.js</i> are needed to pass the library functions to the entire application:-->

在 <i>index.js</i> 中需要增加一些内容，以便将这个库中的函数传递给整个应用。


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

<!--We can now retrieve the notes in the <i>App</i> component. The code expands as follows:-->

我们现在就可以从  <i>App</i> 组件中获取笔记了。相关代码如下：

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

<!--Retrieving data from the server is still done in the familiar way with the Axios <i>get</i> method. However, the Axios method call is now wrapped in a [query](https://tanstack.com/query/latest/docs/react/guides/queries) formed with the [useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery) function. The first parameter of the function call is a string <i>notes</i> which acts as a [key](https://tanstack.com/query/latest/docs/react/guides/query-keys)  to the query defined, i.e. the list of notes.-->

从服务器中获取数据的方式和 Axios 的 *get* 方法类似。然而，Axios 的调用方法现在被包装在一个用 [useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery) 函数形成的 [query](https://tanstack.com/query/latest/docs/react/guides/queries) 查询中。在这个函数调用中，第一个参数（字符串 "<i>notes</i>" ）是已定义查询的 [key](https://tanstack.com/query/latest/docs/react/guides/query-keys)，即笔记列表。

<!--The return value of the <i>useQuery</i> function is an object that indicates the status of the query. The output to the console illustrates the situation:--> 

*useQuery* 函数的返回值是一个包含查询状态的对象。控制台中的输出展现了这个情境：

![browser devtools showing success status](../../images/6/60new.png)

<!--That is, the first time the component is rendered, the query is still in <i>loading</i> state, i.e. the associated HTTP request is pending. At this stage, only the following is rendered:-->

当组件第一次被渲染时，查询仍处于*加载*状态，即，相关的 HTTP 请求仍在等待中。在这个阶段，只有如下元素会被渲染：

```html
<div>loading data...</div>
```

<!--However, the HTTP request is completed so quickly that even the most astute will not be able to see the text. When the request is completed, the component is rendered again. The query is in the state <i>success</i> on the second rendering, and the field <i>data</i> of the query object contains the data returned by the request, i.e. the list of notes that is rendered on the screen.-->

然而， HTTP 请求在瞬息之内完成，甚至最敏锐的人也无法看到这个文本。当请求完成后，这个组件会被重新渲染。在第二次渲染中，查询的状态为*成功*，而且，查询对象的 *data* 字段中包含了请求返回的数据，即，屏幕上显示的笔记列表。

<!--So the application retrieves data from the server and renders it on the screen without using the React hooks <i>useState</i> and <i>useEffect</i> used in chapters 2-5 at all. The data on the server is now entirely under the administration of the React Query library, and the application does not need the state defined with React's <i>useState</i> hook at all!-->

因此，这个应用可以从服务器中获取数据并将其渲染到屏幕上，而完全不使用我们在第 2 章至第 5 章谈及的 React 钩子—— *useState* 和 *useEffect*。服务器中的数据现在完全在 React Query 库的管理下，应用程序完全不需要用 React 的 useState 钩子定义状态！

<!--Let's move the function making the actual HTTP request to its own file <i>requests.js</i>-->

让我们将发出实际 HTTP 请求的函数，移动到单独的 <i>requests.js</i> 文件中。

```js
import axios from 'axios'

export const getNotes = () =>
  axios.get('http://localhost:3001/notes').then(res => res.data)
```

<!--The <i>App</i> component is now slightly simplified-->

现在，*APP* 组件变得稍微简洁了。

```js
import { useQuery } from 'react-query' 
import { getNotes } from './requests' // highlight-line

const App = () => {
  // ...

  const result = useQuery('notes', getNotes)  // highlight-line

  // ...
}
```

The current code for the application is in [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-1) in the branch <i>part6-1</i>.

当前应用的代码可以在 [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-1) 上 *part6-1* 的分支中找到。

### <!--Synchronizing data to the server using React Query-->

### 使用 React Query 将数据同步至服务器

<!--Data is already successfully retrieved from the server. Next, we will make sure that the added and modified data is stored on the server. Let's start by adding new notes.-->

数据已经成功地从服务器中检索出来。接下来，我们将确保对数据的新增和修改也会存储到服务器中。让我们从新增笔记开始。

<!--Let's make a function <i>createNote</i> to the file <i>requests.js</i> for saving new notes:-->

让我们在 *requests.js* 中构建一个 *createNote* 函数，用以存储新笔记：

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

export const getNotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createNote = newNote => // highlight-line
  axios.post(baseUrl, newNote).then(res => res.data) // highlight-line
```

<!--The <i>App</i> component will change as follows-->

*App* 组件相应做出如下更新：

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

<!--To create a new note, a [mutation](https://tanstack.com/query/latest/docs/react/guides/mutations) is defined using the function [useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation):-->

为了新增一条笔记，我们需要用 [useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation) 创建一个 [mutation（突变）](https://tanstack.com/query/latest/docs/react/guides/mutations)。

```js
const newNoteMutation = useMutation(createNote)
```

<!--The parameter is the function we added to the file <i>requests.js</i>, which uses Axios to send a new note to the server.-->

*useMutation* 的参数即是我们在 *requests.js* 中添加的函数——它使用 Axios 向服务器发送一条新笔记。

<!--The event handler <i>addNote</i> performs the mutation by calling the mutation object's function <i>mutate</i> and passing the new note as a parameter:-->

事件处理器 *addNote* 在调用 mutation 对象中的 mutate 函数时，将新笔记作为参数传入，以执行 mutation ：


```js
newNoteMutation.mutate({ content, important: true })
```

<!--Our solution is good. Except it doesn't work. The new note is saved on the server, but it is not updated on the screen.-->

我们的解决方案挺不错，但仍有改进空间。新的笔记虽然存储在了服务器上，但并没有在屏幕上更新。

<!--In order to render a new note as well, we need to tell React Query that the old result of the query whose key is the string <i>notes</i> should be [invalidated](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations).-->

为了能渲染出新的笔记，我们需要告诉 React Query，应该使 key 为 *notes* 的旧查询结果 [invalidated（无效）](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations)。

<!--Fortunately, invalidation is easy, it can be done by defining the appropriate <i>onSuccess</i> callback function to the mutation:-->

幸运的是，无效化很容易，它可以通过为 mutation 定义适当的 *onSuccess* 回调函数来完成：

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

<!--Now that the mutation has been successfully executed, a function call is made to-->

在 mutation 已经成功执行后，一个函数被调用：

```js
queryClient.invalidateQueries('notes')
```

<!--This in turn causes React Query to automatically update a query with the key <i>notes</i>, i.e. fetch the notes from the server. As a result, the application renders the up-to-date state on the server, i.e. the added note is also rendered.-->

这让 React Query 通过从服务器上获取笔记。自动更新 key 为 *notes* 的查询。因此，应用渲染了服务器上最新的状态，包括刚刚新增的笔记。

<!--Let us also implement the change in the importance of notes. A function for updating notes is added to the file <i>requests.js</i>:-->

让我们加入更改笔记重要性的功能。更新笔记的函数被加入到文件 *requests.js* 中:

```js
export const updateNote = updatedNote =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(res => res.data)
```

<!--Updating the note is also done by mutation. The <i>App</i> component expands as follows:-->

更新笔记同样通过 mutation 来完成。*App* 组件扩展为如下：

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

<!--So again, a mutation was created that invalidated the query <i>notes</i> so that the updated note is rendered correctly. Using mutation is easy, the method <i>mutate</i> receives a note as a parameter, the importance of which has been changed to the negation of the old value.-->

一个能够无效化查询的 mutation 被再次创建，更新后的笔记也可以正常渲染。使用 mutation 很轻松，*mutate* 方法接收一个笔记作为参数，这个笔记的重要性已变为旧值的反义。

<!--The current code for the application is in [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) in the branch <i>part6-2</i>.-->

当前应用的代码可以在 [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) 上 *part6-2* 的分支中找到。

### <!--Optimizing the performance-->

### 优化性能

<!--The application works well, and the code is relatively simple. The ease of making changes to the list of notes is particularly surprising. For example, when we change the importance of a note, invalidating the query <i>notes</i> is enough for the application data to be updated:-->

应用目前运转良好，代码也相对简单。对笔记列表的更改也异常轻松。例如，当我们改变了笔记的重要性，使 key 为 *notes* 的查询无效即可更新应用中的数据。

```js
  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes') // highlight-line
    },
  })
```

<!--The consequence of this, of course, is that after the PUT request that causes the note change, the application makes a new GET request to retrieve the query data from the server:-->

但这样的话，应用会在一个导致笔记更新的 PUT 请求后，创建一个 GET 请求向服务器获取数据。

![devtools network tab with highlight over 3 and notes requests](../../images/6/61new.png)

<!--If the amount of data retrieved by the application is not large, it doesn't really matter. After all, from a browser-side functionality point of view, making an extra HTTP GET request doesn't really matter, but in some situations it might put a strain on the server.-->

如果应用从服务器中获取的数据量不大，这样的更新流程无关紧要。毕竟，从浏览器功能的角度来看，额外的一个 HTTP 请求并不重要，但在某些情况下，这可能会给服务器带来压力。

<!--If necessary, it is also possible to optimize performance [by manually updating](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses) the query state maintained by React Query.-->
必要情况下，也可以通过 [手动更新](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses) React Query 所维护的查询状态，以实现性能优化。

<!--The change for the mutation adding a new note is as follows:-->

对新增笔记的 mutation，做出如下更改：

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

<!--That is, in the <i>onSuccess</i> callback, the <i>queryClient</i> object first reads the existing <i>notes</i> state of the query and updates it by adding a new note, which is obtained as a parameter of the callback function. The value of the parameter is the value returned by the function <i>createNote</i>, defined in the file <i>requests.js</i> as follows:-->

在 *onSuccess* 的回调函数中，*queryClient* 对象首先读取已经存在的笔记状态，并加入在回调函数参数中获取到的新增笔记以实现更新。回调函数参数的值，即为在 <i>requests.js</i> 中定义的 *createNote* 函数所返回的值：

```js
export const createNote = newNote =>
  axios.post(baseUrl, newNote).then(res => res.data)
```

<!--It would be relatively easy to make a similar change to a mutation that changes the importance of the note, but we leave it as an optional exercise.-->

用类似的方法去更新笔记的重要性也相对简单，但我们把这留作一个可选练习。

<!--If we closely follow the browser's network tab, we notice that React Query retrieves all notes as soon as we move the cursor to the input field:-->

如果我们仔细观察浏览器的网络面板，我们会注意到：当我们将光标移动至输入框时，React Query 会立即去获取全部笔记。

![dev tools notes app with input text field highlighted and arrow on network over notes request as 200](../../images/6/62new.png)

<!--What is going on? By reading the [documentation](https://tanstack.com/query/latest/docs/react/reference/useQuery), we notice that the default functionality of React Query's queries is that the queries (whose status is <i>stale</i>) are updated when <i>window focus</i>, i.e. the active element of the application's user interface, changes. If we want, we can turn off the functionality by creating a query as follows:-->

发生了什么？通过阅读 [文档](https://tanstack.com/query/latest/docs/react/reference/useQuery) ，我们注意到 React Query 查询的默认功能是：当窗口焦点，即应用中用户界面的活动元素，发生变化时，查询（其状态为 *stale*）会被更新。如果我们希望，我们可以按以下方式创建查询，以关闭这个功能：

```js
const App = () => {
  // ...
  const result = useQuery('notes', getNotes, {
    refetchOnWindowFocus: false  // highlight-line
  })

  // ...
}
```

<!--If you put a console.log statement to the code, you can see from browser console how often React Query causes the application to be re-rendered. The rule of thumb is that rerendering happens at least whenever there is a need for it, i.e. when the state of the query changes. You can read more about it e.g. [here](https://tkdodo.eu/blog/react-query-render-optimizations).-->

如果你在代码中放入 console.log，就会在浏览器的控制台中发现： React Query 引发的应用重复渲染是多么频繁。经验法则是，应在有需要的时候（即在查询状态发生变化时），才进行重新渲染。你可以在 [这里](https://tkdodo.eu/blog/react-query-render-optimizations) 了解更多。

<!--The code for the application is in [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) in the branch <i>part6-3</i>.-->

当前应用的代码可以在 [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) 上 *part6-3* 的分支中找到。

<!--React Query is a versatile library that, based on what we have already seen, simplifies the application. Does React Query make more complex state management solutions such as Redux unnecessary? No. React Query can partially replace the state of the application in some cases, but as the [documentation](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state) states-->

React Query 一个多功能的库，根据我们已看到的情况，它简化了应用。那么，React Query 是否让更复杂的状态管理解决方案，如 Redux，变得无足轻重了呢？并非如此，在某些情况下，React Query 可以部分替代应用程序的状态，但是正如 [文档](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state) 所说：

- <!--React Query is a <i>server-state library</i>, responsible for managing asynchronous operations between your server and client-->
- React Query 是 *服务器状态的库*，负责管理服务器和客户端之间的异步操作。
- <!--Redux, etc. are <i>client-state libraries</i> that can be used to store asynchronous data, albeit inefficiently when compared to a tool like React Query-->
- Redux 等则是*客户端状态的库*，可以用来存储异步数据，尽管效率不如 React Query 这样的工具。

<!--So React Query is a library that maintains the <i>server state</i> in the frontend, i.e. acts as a cache for what is stored on the server. React Query simplifies the processing of data on the server, and can in some cases eliminate the need for data on the server to be saved in the frontend state.-->

因此，React Query 是一个在前端维护服务器状态的库，即作为服务器存储内容的缓存。React Query 简化了对服务器数据的处理，在某些情况下，可以消除将服务器数据存储在前端的需求。

<!--Most React applications need not only a way to temporarily store the served data, but also some solution for how the rest of the frontend state (e.g. the state of forms or notifications) is handled.-->

大多数 React 应用不仅需要一种临时存储服务器数据的方法，还需要一些处理其他前端状态（例如表单和通知的状态）的解决方案。

</div>

<div class="tasks">

### Exercises 6.20.-6.22.

<!--Now let's make a new version of the anecdote application that uses the React Query library. Take [this project](https://github.com/fullstack-hy2020/query-anecdotes) as your starting point. The project has a ready-installed JSON Server, the operation of which has been slightly modified. Start the server with <i>npm run server</i>.-->

现在，让我们用 React Query 打造一个新版的箴言应用。用 [这个项目](https://github.com/fullstack-hy2020/query-anecdotes) 作为你的起点。初始项目已经安装了 JSON 服务器，其操作方式被稍加修改。使用 *npm run server* 启动应用。

#### Exercise 6.20

<!--Implement retrieving anecdotes from the server using React Query.-->

使用 React Query，实现从服务器上获取箴言。

<!--The application should work in such a way that if there are problems communicating with the server, only an error page will be displayed:-->

当和服务器通信出现问题时，将只展示一个错误页面。

![browser saying anecdote service not available due to problems in server on localhost](../../images/6/65new.png)

<!--You can find [here](https://tanstack.com/query/latest/docs/react/guides/queries) info how to detect the possible errors.-->

你可以在 [这里](https://tanstack.com/query/latest/docs/react/guides/queries) 找到如何检测可能错误的信息。

<!--You can simulate a problem with the server by e.g. turning off the JSON Server. Please note that in a problem situation, the query is first in the state <i>isLoading</i> for a while, because if a request fails, React Query tries the request a few times before it states that the request is not successful. You can optionally specify that no retries are made:-->

你可以在通过关闭 JSON 服务器来模拟服务器故障。请注意在某种故障情况下，查询会在 *isLoading* 状态中停留一会儿，这是因为在一次请求失败后，React Query 会在多尝试几次后，才反馈请求失败。你可以选择不进行这种额外尝试：


```js
const result = useQuery(
  'anecdotes', getAnecdotes, 
  {
    retry: false
  }
)
```

<!--or that the request is retried e.g. only once:-->

你也可以指定仅额外尝试一次：

```js
const result = useQuery(
  'anecdotes', getAnecdotes, 
  {
    retry: 1
  }
)
```

#### Exercise 6.21

<!--Implement adding new anecdotes to the server using React Query. The application should render a new anecdote by default. Note that the content of the anecdote must be at least 5 characters long, otherwise the server will reject the POST request. You don't have to worry about error handling now.-->

使用 React Query 向服务器添加新的箴言。这个应用默认应渲染出全部箴言。注意，箴言的内容应不少于 5 个字符，否则，服务器将拒绝 POST 请求。你目前还不用考虑异常处理。

#### Exercise 6.22

<!--Implement voting for anecdotes using again the React Query. The application should automatically render the increased number of votes for the voted anecdote-->

使用 React Query 再次实现以投票功能。应用应该可以自动渲染被投票箴言的最新票数。

</div>

<div class="content">


### useReducer

<!--So even if the application uses React Query, some kind of solution is usually needed to manage the rest of the frontend state (for example, the state of forms). Quite often, the state created with <i>useState</i> is a sufficient solution. Using Redux is of course possible, but there are other alternatives.-->

即使应用使用了 React query，通常还需要某种解决方案以管理前端的其他状态（例如，表单状态）。通常，利用 *useState* 创建的状态足以应对这种状况。使用 Redux 当然也没问题，但是我们还有其他选择。

<!--Let's look at a simple counter application. The application displays the counter value, and offers three buttons to update the counter status:-->

让我们看一个简单的计数应用。这个应用显示计数器的值，并提供三个按钮以更新计数器的状态：

![browser showing + - 0 buttons and 7 above](../../images/6/63new.png)

<!--We shall now implement the counter state management using a Redux-like state management mechanism provided by React's built-in [useReducer](https://beta.reactjs.org/reference/react/useReducer) hook. Code looks like the following:-->

现在，我们利用 React 内置的 [useReducer](https://beta.reactjs.org/reference/react/useReducer)  钩子来进行状态管理，useReducer 钩子具有类似 Redux 的状态管理机制。代码如下：

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

<!--The hook [useReducer](https://beta.reactjs.org/reference/react/useReducer) provides a mechanism to create a state for an application. The parameter for creating a state is the reducer function that handles state changes, and the initial value of the state:-->

[useReducer](https://beta.reactjs.org/reference/react/useReducer) 钩子提供了为应用创建状态的机制。创建一个状态所需的参数有：处理状态变化的 reducer 函数，以及状态的初始值:

```js
const [counter, counterDispatch] = useReducer(counterReducer, 0)
```

<!--The reducer function that handles state changes is similar to Redux's reducers, i.e. the function gets as parameters the current state and the action that changes the state. The function returns the new state updated based on the type and possible contents of the action:-->

处理状态变化的 reducer 函数和 Redux 中的 reducers 类似，即，用该函数获得当前状态和改变此状态的 action 作为参数。该函数根据 action 的类型和其中的内容而返回更新后的状态。

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

<!--In our example, actions have nothing but a type. If the action's type is <i>INC</i>, it increases the value of the counter by one, etc. Like Redux's reducers, actions can also contain arbitrary data, which is usually put in the action's <i>payload</i> field.-->

在我们的例子中，action 只有类型这一个字段。如果动作的类型是 *INC*，它就会将计数器的值增加 1，其他也类似。正如 Redux 的 reducers，actions 也可以包含任意的数据，这些数据通常都被放在 *payload* 字段中。

<!--The function <i>useReducer</i> returns an array that contains an element to access the current value of the state (first element of the array), and a <i>dispatch</i> function (second element of the array) to change the state:-->

<i>useReducer</i> 函数返回一个数组，该数组包含一个可以访问当前状态值的元素（数组的第一个元素），以及一个用于改变状态的 *dispatch* 函数（数组的第二个元素）：

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

<!--As can be seen the state change is done exactly as in Redux, the dispatch function is given the appropriate state-changing action as a parameter:-->

我们对状态的更改顺利完成，正如利用 Redux 一样。恰当的状态改变类型被传入 dispatch 函数作为参数：

```js
counterDispatch({ type: "INC" })
```

<!--The current code for the application is in the repository [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) in the branch <i>part6-1</i>.-->

当前应用的代码可以在 [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) 上 *part6-1* 的分支中找到。

### <!--Using context for passing the state to components-->

### 使用 context 传递组件的状态

<!--If we want to split the application into several components, the value of the counter and the dispatch function used to manage it must also be passed to the other components. One solution would be to pass these as props in the usual way:-->

如果我们希望将应用拆分成多个组件，我们必须将计数器的值和用于管理它的 dispatch 函数也传递给其他组件。一个解决方案是将计数器的值和 dispatch 函数作为参数传递：

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

<!--The solution works, but is not optimal. If the component structure gets complicated, e.g. the dispatcher should be forwarded using props through many components to the components that need it, even though the components in between in the component tree do not need the dispatcher. This phenomenon is called <i>prop drilling</i>.-->

这个解决方案是可行的，但并不是最优的。如果组件的结构变得更复杂，例如，需要经过多个组件才能将 dispatch 函数转发到真正需要它的组件，即使处于组件树中的其他组件都不需要它。这种现象被称为 *prop drilling*.

<!--React's built-in [Context API](https://beta.reactjs.org/learn/passing-data-deeply-with-context) provides a solution for us. React's context is a kind of global state of the application, to which it is possible to give direct access to any component app.-->

React 内置的 [Context API](https://beta.reactjs.org/learn/passing-data-deeply-with-context) 为我们提供了一个解决方案。React 的 context 类似应用的全局状态，应用中的组件均可以直接访问它。

<!--Let us now create a context in the application that stores the state management of the counter.-->

现在，让我们在应用中创建一个 context，用以存储计数器的状态。

<!--The context is created with React's hook [createContext](https://beta.reactjs.org/reference/react/createContext). Let's create a context in the file <i>CounterContext.js</i>:-->

使用 React 的 [createContext](https://beta.reactjs.org/reference/react/createContext) 钩子创建 context。让我们在文件 *CounterContext.js* 中创建 context:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

<!--The <i>App</i> component can now <i>provide</i> a context to its child components as follows:-->

*App* 组件现在可以通过如下的方式，向子组件提供 context:

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

<!--As can be seen, providing the context is done by wrapping the child components inside the <i>CounterContext.Provider</i> component and setting a suitable value for the context.-->

可以看到，我们通过将子组件包裹在 *CounterContext.Provider* 组件中，并为 context 设置合适的值，以传递 context。

<!--The context value is now set to be an array containing the value of the counter, and the <i>dispatch</i> function.-->

context 的值现在被设置为一个包含了计数器的值和 *dispatch* 函数的数组。

<!--Other components now access the context using the [useContext](https://beta.reactjs.org/reference/react/useContext) hook:-->

其他的组件现在可以通过使用 [useContext](https://beta.reactjs.org/reference/react/useContext) 钩子来访问 context。

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

<!--The current code for the application is in [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) in the branch <i>part6-2</i>.-->

当前应用的代码可以在 [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) 上 *part6-2* 的分支中找到。

### <!--Defining the counter context in a separate file-->

### 在单独的文件中定义计数器的 context

<!--Our application has an annoying feature, that the functionality of the counter state management is partly defined in the <i>App</i> component. Now let's move everything related to the counter to <i>CounterContext.js</i>:-->

我们的应用有个令人讨厌的特点：计数器一部分状态管理的功能，是在 *APP* 组件中定义的。现在，让我们将和计数器有关的内容，都移动到 *CounterContext.js*。

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

<!--The file now exports, in addition to the <i>CounterContext</i> object corresponding to the context, the <i>CounterContextProvider</i> component, which is practically a context provider whose value is a counter and a dispatcher used for its state management.-->

这个文件除了导出和 context 对应的 *CounterContext* 对象外，还导出了<i>CounterContextProvider</i> 组件，这个组件实际上是一个 context 提供方，它的值包括一个计数器和一个用于其状态管理的调度器。

<!--Let's enable the context provider by making a change in <i>index.js</i>:-->

让我们更新 *index.js* ，以启用 context 提供方：

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

<!--Now the context defining the value and functionality of the counter is available to <i>all</i> components of the application.-->

现在，定义了计数器的值和功能的 context，可以被应用中的*所有*组件使用。

<!--The <i>App</i> component is simplified to the following form:-->

*App* 组件则被简化成如下的形式：

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

<!--The context is still used in the same way, e.g. the component <i>Button</i> is defined as follows:-->

对 context 的使用仍然遵循先前的相同方法，例如， *Button* 组件可以通过如下的方式定义：

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

<!--The <i>Button</i> component only needs the <i>dispatch</i> function of the counter, but it also gets the value of the counter from the context using the function <i>useContext</i>:-->

*Button* 组件仅需要计数器的 *dispatch* 函数，但是它也可以通过 *useContext* 从 context 中获取计数器的值：

```js
  const [counter, dispatch] = useContext(CounterContext)
```

<!--This is not a big problem, but it is possible to make the code a bit more pleasant and expressive by defining a couple of helper functions in the <i>CounterContext</i> file:-->

这不是个大问题，但是我们可以通过在 *CounterContext* 文件中编写一些辅助函数，使我们的代码更加优雅和清晰：

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

<!--With the help of these helper functions, it is possible for the components that use the context to get hold of the part of the context that they need. The <i>Display</i> component changes as follows:-->

有了辅助函数的帮助，组件使用 context 就可以只获取它们所需要的那部分。*Display* 组件的更新如下：

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

<!--Component <i>Button</i> becomes:-->

Button 组件更新为：

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

<!--The solution is quite elegant. The entire state of the application, i.e. the value of the counter and the code for managing it, is now isolated in the file <i>CounterContext</i>, which provides components with well-named and easy-to-use auxiliary functions for managing the state.-->

这个解决方案非常优雅。整个应用的状态，即，计数器的值和管理值的代码，已经独立放置于  <i>CounterContext</i> 文件中，这个文件提供了命名良好和易于使用的辅助函数来管理状态。

<!--The final code for the application is in [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3) in the branch <i>part6-3</i>.-->

当前应用的代码可以在 [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3) 上 *part6-3* 的分支中找到。

<!--As a technical detail, it should be noted that the helper functions <i>useCounterValue</i> and <i>useCounterDispatch</i> are defined as [custom hooks](https://reactjs.org/docs/hooks-custom.html), because calling the hook function <i>useContext</i> is [possible](https://reactjs.org/docs/hooks -rules.html) only from React components or custom hooks. Custom hooks are JavaScript functions whose name must start with the string _use_. We will return to custom hooks in a little more detail in [part 7](/en/part7/custom_hooks) of the course.-->

作为一个技术细节，应当注意到辅助函数——<i>useCounterValue</i> 和 <i>useCounterDispatch</i>，是 [自定义钩子（custom hooks）](https://reactjs.org/docs/hooks-custom.html)，因为[只能](https://reactjs.org/docs/hooks -rules.html)通过 React 组件或自定义钩子调用钩子函数——*useContext*。此外，自定义钩子是必须以 *use* 作为名称开头的 JavaScript 函数。我们将在这门课程的 [part 7](/en/part7/custom_hooks) 更深入地探讨自定义钩子。

</div>

<div class="tasks">

### Exercises 6.22.-6.23.

#### Exercise 6.22.

<!--The application has a <i>Notification</i> component for displaying notifications to the user.-->

应用有一个 Notification 的组件，用于向用户展示通知。

<!--Implement the application's notification state management using the useReducer hook and context. The notification should tell the user when a new anecdote is created or an anecdote is voted on:-->

使用 useReducer 和 context 实现应用程序通知功能的状态管理。当新的箴言被创建或被投票时，应该向用户推送通知。

![browser showing notification for added anecdote](../../images/6/66new.png)

<!--The notification is displayed for five seconds.-->

通知应显示 5 秒。

#### Exercise 6.24.

<!--As stated in exercise 6.21, the server requires that the content of the anecdote to be added is at least 5 characters long. Now implement error handling for the insertion. In practice, it is sufficient to display a notification to the user in case of a failed POST request:-->

正如在练习 6.20 中说明的，被添加至服务器的箴言，长度不应少于 5 个字符。现在我们在新增操作中添加异常处理。在实践中，当 POST 请求失败时，向用户展示一条通知就足够了。

![browser showing error notification for trying to add too short of an anecdoate](../../images/6/67new.png)

<!--The error condition should be handled in the callback function registered for it, see [here](https://tanstack.com/query/latest/docs/react/reference/useMutation) how to register a function.-->

触发的错误情境应在回调函数中处理——被注册的回调函数会专门处理该种错误情境，你可以在[这里](https://tanstack.com/query/latest/docs/react/reference/useMutation)了解如何注册一个函数。

<!--This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your completed exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->

这是该部分课程的最后一个练习，现在是时候将你的代码推送至 GitHub，并在[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中将所有你已完成的练习进行标注。

</div>

<div class="content">
### <!--Which state management solution to choose?-->

### 应该选择哪一个状态管理方案？



<!--In chapters 1-5, all state management of the application was done using React's hook <i>useState</i>. Asynchronous calls to the backend required the use of the <i>useEffect</i> hook in some situations. In principle, nothing else is needed.-->

在 1 至 5 章中，应用的所有状态管理都通过 React 的钩子 —— *useState* 来处理. 偶尔，对后端的异步调用还需要用上 *useEffect*。通常情况下，我们就不再需要额外的东西了。

<!--A subtle problem with a solution based on a state created with the <i>useState</i> hook is that if some part of the application's state is needed by multiple components of the application, the state and the functions for manipulating it must be passed via props to all components that handle the state. Sometimes props need to be passed through multiple components, and the components along the way may not even be interested in the state in any way. This somewhat unpleasant phenomenon is called <i>prop drilling</i>.-->

在使用 *useState* 作为状态管理解决方案时，存在一个微妙的问题：如果应用某部分状态被多个组件需要，那么该状态和对应的操作状态的函数，必须通过 props 在所有处理状态的组件中层层传递。有时，props 需要在多个组件中传递，虽然这些过程中的组件并不需要该状态。这种有些令人不快的现象叫做 <i>prop drilling</i> 。

<!--Over the years, several alternative solutions have been developed for state management of React applications, which can be used to ease problematic situations (e.g. prop drilling). However, no solution has been "final", all have their own pros and cons, and new solutions are being developed all the time.-->

过去几年中，一些针对 Rect 应用状态管理的替代方案开始显露头角，它们可用于解决棘手的状况（例如：prop drilling）。然而，目前还不存在一个终极方案，当下所有的方案都有其自己的优势和劣势，而且新的解决方案还在层出不穷。

<!--The situation may confuse a beginner and even an experienced web developer. Which solution should be used?-->

这种状况可能让初学者、甚至经验丰富的网页开发者感到无所适从——究竟应该使用哪一种方案？

<!--For a simple application, <i>useState</i> is certainly a good starting point. If the application is communicating with the server, the communication can be handled in the same way as in chapters 1-5, using the state of the application itself. Recently, however, it has become more common to move the communication and associated state management at least partially under the control of React Query (or some other similar library). If you are concerned about useState and the prop drilling it entails, using context may be a good option. There are also situations where it may make sense to handle some of the state with useState and some with contexts.-->

对于简单的应用，*useState* 是个很好的起点。如果应用需要和服务器进行通信的话，这样的通信可以用与 1 - 5 章中相同的方式处理——即利用应用本身的状态。然而最近，利用 React Query （或类似的库）去处理全部，或至少一部分，通信和相关的状态管理，已变得越来越普遍。如果你对 *useState* 及相应的 prop drilling 抱有疑虑，context 可能会是一个好的选择。在一些情境下，利用 useState 管理部分状态，同时使用 context 管理其他部分的状态，也会是合理的。

<!--The most comprehensive and robust state management solution is Redux, which is a way to implement the so-called [Flux](https://facebookarchive.github.io/flux/) architecture. Redux is slightly older than the solutions presented in this section. The rigidity of Redux has been the motivation for many new state management solutions, such as React's <i>useReducer</i>. Some of the criticisms of Redux's rigidity have already become obsolete thanks to the [Redux Toolkit](https://redux-toolkit.js.org/).-->

Redux 是其中最全面和强大的状态管理方案，它是实现所谓 [Flux](https://facebook.github.io/flux/) 架构的一种方式。Redux 比本章介绍的方案更有历史。Redux 过去的僵化成为了当前很多新状态管理工具的开发动力，例如 React 的 *useReducer* 。但在有了 [Redux Toolkit](https://redux-toolkit.js.org/) 后，对 Redux 僵化的批评已经消散。

<!--Over the years, there have also been other state management libraries developed that are similar to Redux, such as the newer entrant [Recoil](https://recoiljs.org/) and the slightly older [MobX](https://mobx.js.org/). However, according to [Npm trends](https://npmtrends.com/mobx-vs-recoil-vs-redux), Redux still clearly dominates, and in fact seems to be increasing its lead:-->

过去几年中，类似 Redux 的状态管理库层出不穷，比如新晋的 [Recoil](https://recoiljs.org/) 和略老一些的 [MobX](https://mobx.js.org/)。然而，根据 [Npm 趋势](https://npmtrends.com/mobx-vs-recoil-vs-redux)，Redux 仍旧是主宰，而且甚至扩大了领先优势。

![graph showing redux growing in popularity over past 5 years](../../images/6/64new.png)

<!--Also, Redux does not have to be used in its entirety in an application. It may make sense, for example, to manage the form state outside of Redux, especially in situations where the state of a form does not affect the rest of the application. It is also perfectly possible to use Redux and React Query together in the same application.-->

此外，Redux 不需要应用于整个应用。例如，当一个表单状态完全不影响应用的其他状态时，不使用 Reudx 去管理表单状态也是合理的。另外，在一个应用中，同时使用 Redux 和 React Query 也是完全可以接受的。

<!--The question of which state management solution should be used is not at all straightforward. It is impossible to give a single correct answer. It is also likely that the selected state management solution may turn out to be suboptimal as the application grows to such an extent that the solution have to be changed even if the application has already been put into production use.-->

该选择哪一个状态管理方案？这个问题并不容易回答，也无法给出一个单一的正确答案。当应用增长到一定程度，此前的状态管理方案也可能成为一个次优的选择，即使该应用已经投入了生产使用。

</div>

