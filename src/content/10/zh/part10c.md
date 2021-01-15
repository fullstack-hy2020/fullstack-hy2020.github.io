---
mainImage: ../../../images/part-10.svg
part: 10
letter: c
lang: zh
---

<div class="content">

<!-- So far we have implemented features to our application without any actual server communication. For example, the reviewed repositories list we have implemented uses mock data and the sign in form doesn't send the user's credentials to any authorization endpoint. In this section, we will learn how to communicate with a server using HTTP requests, how to use Apollo Client in a React Native application, and how to store data in the user's device. -->

到目前为止，我们实现了应用的一些特性，但没有真实的服务端通信。举个例子，我们实现的仓库查看列表使用的是模拟数据，并且登录表单并没有将用户的认证信息传递给任何授权接口。在这一章，我们会学习如何使用HTTP请求与服务端通信，如何在React Native 中使用Appolo 客户端，以及如何在用户的设备中存储数据。

<!-- Soon we will learn how to communicate with a server in our application. Before we get to that, we need a server to communicate with. For this purpose, we have a completed server implementation in the [rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api) repository. The rate-repository-api server fulfills all our application's API needs during this part. It uses [SQLite](https://www.sqlite.org/index.html) database which doesn't need any setup and provides an Apollo GraphQL API along with a few REST API endpoints. -->

很快我们会学到如何在应用中与服务端通信。但在这之前，我们需要一个用来通信的服务。为了达成这个目的，我们有一个完整的服务端实现，放在了[rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api) 仓库中。rate-repository-api 服务端程序满足了我们这一章应用的API需求，它使用了 [SQLite](https://www.sqlite.org/index.html) 数据库，并不需要安装步骤，服务端还提供了Apollo GraphQL API， 带有一些REST API 接口。

<!-- Before heading further into the material, set up the rate-repository-api server by following the setup instructions in the repository's [README](https://github.com/fullstack-hy2020/rate-repository-api/blob/master/README.md). Note that if you are using an emulator for development it is recommended to run the server and the emulator <i>on the same computer</i>. This eases network requests considerably. -->

在我们深入教材前，按仓库中的 [README](https://github.com/fullstack-hy2020/rate-repository-api/blob/master/README.md) 安装指引，搭建起rate-repository-api 服务。注意如果你开发时如果正在使用模拟器，建议将服务端程序和模拟器运行在<i>同一台电脑</i>中，这会极大地简化网络请求。 

### HTTP requests
HTTP 请求

<!-- React Native provides [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making HTTP requests in our applications. React Native also supports the good old [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) which makes it possible to use third-party libraries such as [Axios](https://github.com/axios/axios). These APIs are the same as the ones in the browser environment and they are globally available without the need for an import. -->

React Native 提供了[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，在我们的应用中来创建HTTP 请求，React Native 同样支持老派的 [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) ， 这样就能够使用例如[Axios](https://github.com/axios/axios)的三方库。这些API 与浏览器环境的API相同，并且是全局可用的无需引入。

<!-- People who have used both Fetch API and XMLHttpRequest API most likely agree that the Fetch API is easier to use and more modern. However, this doesn't mean that XMLHttpRequest API doesn't have its uses. For the sake of simplicity, we will be only using the Fetch API in our examples. -->

对于使用过Fetch API 和XMLHttpRequest API的人来说，应该会达成一个一致观点，那就是Fetch API 会更简单而且用起来更现代。但是，这也并不是说XMLHTttpRequest API 没有自己的使用场景。为了简化，我们只会在样例中使用Fetch API。

<!-- Sending HTTP requests using the Fetch API can be done using the <em>fetch</em> function. The first argument of the function is the URL of the resource: -->
利用Fetch API 发送HTTP 请求可以通过<em>fetch</em> 函数完成。第一个入参为资源的URL：

```javascript
fetch('https://my-api.com/get-end-point');
```

<!-- The default request method is <i>GET</i>. The second argument of the <em>fetch</em> function is an options object, which you can use to for example to specify a different request method, request headers, or request body: -->
默认的请求方法为 <i>GET</i>。 <em>fetch</em> 函数的第二个参数是一个option 对象，你可以使用它来指定例如 请求方法、请求头以及请求体：

```javascript
fetch('https://my-api.com/post-end-point', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'firstValue',
    secondParam: 'secondValue',
  }),
});
```

<!-- Note that these URLs are made up and won't (most likely) send a response to your requests. In comparison to Axios, the Fetch API operates on a bit lower level. For example, there isn't any request or response body serialization and parsing. This means that you have to for example set the <i>Content-Type</i> header by yourself and use <em>JSON.stringify</em> method to serialize the request body. -->
注意，这里的URL仅仅是个示例，并不会向你的request 返回一个response。与Axios 相比， Fetch API的操作稍微有点底层。比如说，并没有对request 或response body 的序列化和格式化。也就是说你需要比如说自己使用<em>JSON.stringify</em> 方法来序列化request body 并放到 <i>Content-Type</i> 头中。

<!-- The <em>fetch</em> function returns a promise which resolves a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. Note that error status codes such as 400 and 500 _are not rejected_ like for example in Axios. In case of a JSON formatted response we can parse the response body using the <em>Response.json</em> method: -->
<em>fetch</em> 函数返回一个promise， 会解析成一个 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)对象。注意像400和500 这种错误码  <i>并不是rejected</i> 这与Axios 有些不同。 在JSON 格式化 response 的场景中，我们可以使用 <em>Response.json</em> 方法来解析response body。

```javascript
const fetchMovies = async () => {
  const response = await fetch('https://reactnative.dev/movies.json');
  const json = await response.json();

  return json;
};
```

<!-- For a more detailed introduction to the Fetch API, read the [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) article in the MDN web docs. -->
关于Fetch API更详细的介绍，可以阅读 MDN web 文档的 [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 。

<!-- Next, let's try the Fetch API in practice. The rate-repository-api server provides an endpoint for returning a paginated list of reviewed repositories. Once the server is running, you should be able to access the endpoint at [http://localhost:5000/api/repositories](http://localhost:5000/api/repositories). The data is paginated in a common [cursor based pagination format](https://graphql.org/learn/pagination/). The actual repository data is behind the <i>node</i> key in the <i>edges</i> array. -->

接下来，让我们尝试实践一下Fetch API。 rate-repository-api 服务端提供了一个接口来返回已评论仓库的分页列表。一旦服务端跑起来，你就可以通过[http://localhost:5000/api/repositories](http://localhost:5000/api/repositories) 接口来访问。分页数据是常规的 [cursor based pagination format](https://graphql.org/learn/pagination/)。实际的仓库数据位于<i>edges</i> 数组的<i>node</i>key 中。

<!-- Unfortunately, we can't access the server directly in our application by using the <i>http://localhost:5000/api/repositories</i> URL. To make a request to this endpoint in our application we need to access the server using its IP address in its local network. To find out what it is, open the Expo development tools by running <em>npm start</em>. In the development tools you should be able to see an URL starting with <i>exp://</i> above the QR code: -->
不幸的事，我们并不能在我们的应用中使用 <i>http://localhost:5000/api/repositories</i> 这个URL直接访问服务端。为了向这个接口创建一个请求，我们需要通过IP来访问服务端。为了找到这个IP，运行<em>npm start</em>打开Expo 开发工具。在二维码上面你应该能够在开发工具中看到一个以 <i>exp://</i> 开头的URL。

![Development tools](../../images/10/10.png)

<!-- Copy the IP address between the <i>exp://</i> and <i>:</i>, which is in this example <i>192.168.100.16</i>. Construct an URL in format <i>http://<IP_ADDRESS>:5000/api/repositories</i> and open it in the browser. You should see the same response as you did with the <i>localhost</i> URL. -->
复制这个 <i>exp://</i> 和 <i>:</i> 之间的IP地址， 在本例中就是<i>192.168.100.16</i>。 构造成  <i>http://<IP_ADDRESS>:5000/api/repositories</i> 的URL格式，并在浏览器中打开。你应该会看到和访问<i>localhost</i> 相同的response。

<!-- Now that we know the end point's URL let's use the actual server-provided data in our reviewed repositories list. We are currently using mock data stored in the <em>repositories</em> variable. Remove the <em>repositories</em> variable and replace the usage of the mock data with this piece of code in the <i>RepositoryList.jsx</i> file in the <i>components</i> directory: -->

现在我们了解了接口的URL，让我们在已评论仓库列表中使用真正的服务端数据吧。我们当前使用的模拟数据是存储在<em>repositories</em> 变量中的。移除<em>repositories</em> 变量，并将模拟数据替换成如下代码片段（位于 <i>components</i> 文件夹的<i>RepositoryList.jsx</i> 文件中）：

```javascript
import React, { useState, useEffect } from 'react';
// ...

const RepositoryList = () => {
  const [repositories, setRepositories] = useState();

  const fetchRepositories = async () => {
    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.100.16:5000/api/repositories');
    const json = await response.json();

    console.log(json);

    setRepositories(json);
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  // Get the nodes from the edges array
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // Other props
    />
  );
};

export default RepositoryList;
```

<!-- We are using the React's <em>useState</em> hook to maintain the repository list state and the <em>useEffect</em> hook to call the <em>fetchRepositories</em> function when the <em>RepositoryList</em> component is mounted. We extract the actual repositories into the <em>repositoryNodes</em> variable and replace the previously used <em>repositories</em> variable in the <em>FlatList</em> component's <em>data</em> prop with it. Now you should be able to see actual server-provided data in the reviewed repositories list. -->
我们这里使用了React的<em>useState</em> hook 来维护仓库列表的状态，并使用 <em>useEffect</em> hook 在 <em>RepositoryList</em> 组件挂在时来调用 <em>fetchRepositories</em> 函数。我们将真实的仓库抽取到 <em>repositoryNodes</em> 变量中，并将之前<em>FlatList</em> 组件的 data 属性中的 <em>repositories</em> 变量替换掉。现在你应当能能在仓库查看列表中看到真实的服务端数据了。

<!-- It is usually a good idea to log the server's response to be able to inspect it as we did in the <em>fetchRepositories</em> function. You should be able to see this log message in the Expo development tools if you navigate to your device's logs as we learned in the [Viewing logs](/en/part10/introduction_to_react_native#viewing-logs) section. If you are using the Expo's mobile app for development and the network request is failing, make sure that the computer you are using to run the server and your phone are <i>connected to the same Wi-Fi network</i>. If that's not possible either use an emulator in the same computer as the server is running in or set up a tunnel to the localhost, for example, using [Ngrok](https://ngrok.com/). -->

一般将服务端的response 记录下来是不错的习惯，这样就可以像<em>fetchRepositories</em> 函数那样去检查它。你应当能够在Expo 开发者工具的设备日志中中看到日志信息，正如我们在(/zh/part10/react_native_介绍#viewing-logs) 一节中学到的那样。如果你正在使用Expo 移动app 来开发，而网络请求失败，确保你使用的电脑以及手机 <i>处于同一个Wifi 网络下</i>。如果不能在同一台电脑中使用模拟器和服务端程序，可以能搭建一个localhost 管道，使用[Ngrok](https://ngrok.com/) 这个库。

<!-- The current data fetching code in the </em>RepositoryList</em> component could do some refactoring. For instance, the component is aware of the network request's details such as the end point's URL. In addition, the data fetching code has lots of reuse potential. Let's refactor the component's code by extract the data fetching code into its own hook. Create a directory <i>hooks</i> in the <i>src</i> directory and in that <i>hooks</i> directory create a file <i>useRepositories.js</i> with the following content: -->

当前 </em>RepositoryList</em> 组件的数据获取逻辑可以进行一定的重构。比如说，组件能够了解网络请求的详细信息，比如接口的URL。此外，数据的获取代码有许多重用的可能性。让我们提取出数据获取代码，放到一个单独的hook 中，来重构一下我们的组件。在<i>src</i> 目录中创建一个 hooks 目录，创建一个 <i>useRepositories.js</i> 文件，内容如下：

```javascript
import { useState, useEffect } from 'react';

const useRepositories = () => {
  const [repositories, setRepositories] = useState();
  const [loading, setLoading] = useState(false);

  const fetchRepositories = async () => {
    setLoading(true);

    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.100.16:5000/api/repositories');
    const json = await response.json();

    setLoading(false);
    setRepositories(json);
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  return { repositories, loading, refetch: fetchRepositories };
};

export default useRepositories;
```

<!-- Now that we have a clean abstraction for fetching the reviewed repositories, let's use the <em>useRepositories</em> hook in the <em>RepositoryList</em> component: -->
现在我们获取已评论仓库数据就有了一个干净的抽象，让我们在<em>RepositoryList</em>组件中使用<em>useRepositories</em> 这个hook

```javascript
import React from 'react';
// ...
import useRepositories from '../hooks/useRepositories'; // highlight-line

const RepositoryList = () => {
  const { repositories } = useRepositories(); // highlight-line

  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // Other props
    />
  );
};

export default RepositoryList;
```

<!-- That's it, now the <em>RepositoryList</em> component is no longer aware of the way the repositories are acquired. Maybe in the future, we will acquire them through a GraphQL API instead of a REST API. We will see what happens. -->
就是这样，现在<em>RepositoryList</em> 组件不再知道需要获取仓库的方式了。也许将来，我们会将获取数据的方式从REST API 替换成GraphQL API。现在就来实现它把。

### GraphQL and Apollo client
GraphQL 与 Apollo 客户端

<!-- In [part 8](https://fullstackopen.com/en/part8) we learned about GraphQL and how to send GraphQL queries to an Apollo Server using the [Apollo Client](https://www.apollographql.com/docs/react/) in React applications. The good news is that we can use the Apollo Client in a React Native application exactly as we would with a React web application. -->
在[第8章](https://fullstackopen.com/zh/part8) 中我们学习了GraphQL，以及如何在React 应用中利用[Apollo Client](https://www.apollographql.com/docs/react/) 向 Apollo 服务端发送GraphQL 查询。好消息是我们可以在React Native 应用中使用同样的方式来运用Apollo Client。

<!-- As mentioned earlier, the rate-repository-api server provides a GraphQL API which is implemented with Apollo Server. Once the server is running, you can access the [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/#gatsby-focus-wrapper) at [http://localhost:5000/graphql](http://localhost:5000/graphql). GraphQL Playground is a development tool for making GraphQL queries and inspecting the GraphQL APIs schema and documentation. If you need to send a query in your application _always_ test it with the GraphQL Playground first before implementing it in the code. It is much easier to debug possible problems in the query in the GraphQL Playground than in the application. If you are uncertain what the available queries are or how to use them, click the <i>docs</i> tab to open the documentation: -->
如前面所说的那样， rate-repository-api 服务端提供了一个GraphQL API ，是利用Apollo Server 实现的。一旦服务端运行起来了，你就可以利用[http://localhost:5000/graphql](http://localhost:5000/graphql) 的 [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/#gatsby-focus-wrapper)  访问它了。GraphQL Playground 是一个创建GraphQL 查询和检查GraphQL API schema和文档的开发工具。如果你需要在应用中发送一个查询， 记住 <i>一定</i> 在GraphQL Playground 中先测试以下再来实现代码。在 GraphQL Playground 中 debug 相关问题，比在应用汇总调试要简单得多。如果不确定可获得的查询有哪些、如何使用，点击 <i>docs</i> tab 页来打开文档：

![GraphQL Playground](../../images/10/11.png)

<!-- In our React Native application, we will be using the [Apollo Boost](https://www.npmjs.com/package/apollo-boost) library which is a zero-config way to start using Apollo Client. As a React integration, we will be using the [@apollo/react-hooks](https://www.apollographql.com/docs/react/api/react-hooks/) library, which provides hooks such as [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery) and [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation) for using the Apollo Client. Let's get started by installing the dependencies: -->

在我们的React Native 应用中，我们会使用[Apollo Boost](https://www.npmjs.com/package/apollo-boost) 库，这是一个0配置的启动Apollo 客户端的方法。为了React 的集成，我们会使用[@apollo/react-hooks](https://www.apollographql.com/docs/react/api/react-hooks/)  库，提供了类似[useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery) 的hook和 [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation) 来使用Apollo Client 。 让我先来安装这些应用：

```shell
npm install apollo-boost @apollo/react-hooks graphql
```

<!-- Next, let's create a utility function for creating the Apollo Client with the required configuration. Create a <i>utils</i> directory in the <i>src</i> directory and in that <i>utils</i> directory create a file <i>apolloClient.js</i>. In that file configure the Apollo Client to connect to the Apollo Server: -->
接下来，让我创建一个工具函数，利用需要的配置来创建Apllo Client。 在<i>src</i> 目录中创建一个 <i>utils</i> 文件夹并新建一个 <i>apolloClient.js</i> 文件， 在文件中配置 Apollo Client 来连接Apollo Server：

```javascript
import ApolloClient from 'apollo-boost';

const createApolloClient = () => {
  return new ApolloClient({
    // Replace the IP address part with your own IP address!
    uri: 'http://192.168.100.16:5000/graphql',
  });
};

export default createApolloClient;
```

<!-- The URL used to connect to the Apollo Server is otherwise the same as the one you used with the Fetch API expect the path is <i>/graphql</i>. Lastly, we need to provide the Apollo Client using the [ApolloProvider](https://www.apollographql.com/docs/react/api/react-hooks/#apolloprovider) context. We will add it to the <em>App</em> component in the <i>App.js</i> file: -->
URL 用来连接 Apollo Server， 就像之前使用Fetch API的方法相同，只不过路径变为了 <i>/graphql</i>。 最后，我们需要利用 [ApolloProvider](https://www.apollographql.com/docs/react/api/react-hooks/#apolloprovider) 上下文来提供Apollo 客户端。我们把它放到 <i>App.js</i> 文件的<em>App</em> 组件中：

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks'; // highlight-line

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient'; // highlight-line

const apolloClient = createApolloClient(); // highlight-line

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}> // highlight-line
        <Main />
      </ApolloProvider> // highlight-line
    </NativeRouter>
  );
};

export default App;
```

### Organizing GraphQL related code
组织GraphQL的相关代码

<!-- It is up to you how to organize the GraphQL related code in your application. However, for the sake of a reference structure, let's have a look at one quite simple and efficient way to organize the GraphQL related code. In this structure, we define queries, mutations, fragments, and possibly other entities in their own files. These files are located in the same directory. Here is an example of the structure you can use to get started: -->
应用中如何组织GraphQL的相关代码是因人而异的。但是，为了参考的目的，让我们看一个十分简单和有效的组织GraphQL相关代码的方式。我们定义了queries, mutations, fragments以及可能的其他实体，放到各自的文件中。这些文件放到相同的文件夹下。以下是一个应用架构的例子，你可以以此作为起点：

![GraphQL structure](../../images/10/12.png)

<!-- You can import the [gql](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#gql) template literal tag used to define GraphQL queries from the Apollo Boost library. If we follow the structure suggested above, we could have a <i>queries.js</i> file in the <i>graphql</i> directory for our application's GraphQL queries. Each of the queries can be stored in a variable and exported like this: -->
你可以引入[gql](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#gql) 模版，利用Apollo Boost 库来使用文本化tag 来定义GraphQL 查询。如果我们遵循了上面的应用架构，我们会在<i>graphql</i> 文件夹中有一个<i>queries.js</i> 文件，来存放我们应用的GraphQL查询。每一个查询可以存放到变量，并导出，如下所示：

```javascript
import { gql } from 'apollo-boost';

export const GET_REPOSITORIES = gql`
query {
  repositories {
    ${/* ... */}
  }
}
`;

// other queries...
```

<!-- We can import these variables and use them with the <em>useQuery</em> hook like this: -->
我们可以利用 <em>useQuery</em> hook 来导入这些变量，如下所示：

```javascript
import { useQuery } from '@apollo/react-hooks';

import { GET_REPOSITORIES } from '../graphql/queries';

const Component = () => {
  const { data, error, loading } = useQuery(GET_REPOSITORIES);
  // ...
};
```

<!-- The same goes for organizing mutations. The only difference is that we define them in a different file, <i>mutations.js</i>. It is recommended to use [fragments](https://www.apollographql.com/docs/react/data/fragments/) in queries to avoid retyping the same fields over and over again. -->
可以用同样的方式来组织mutation。 唯一的区别就是把他们定义在不同的文件下，即 <i>mutations.js</i>。 建议在查询中使用 [fragments](https://www.apollographql.com/docs/react/data/fragments/) 来避免重复输入相同的fields。

### Evolving the structure
应用架构的进化版

<!-- Once our application grows larger there might be times when certain files grow too large to manage. For example, we have component <em>A</em> which renders the components <em>B</em> and <em>C</em>. All these components are defined in a file <i>A.jsx</i> in a <i>components</i> directory. We would like to extract components <em>B</em> and <em>C</em> into their own files <i>B.jsx</i> and <i>C.jsx</i> without major refactors. We have two options: -->

一旦我们的应用逐渐变大，甚至成倍增长，某些文件会大到难以管理，比如说我们有一个组件 <i>A</i>， 它渲染了组件 <i>B</i>和 <i>C</i>， 而所有这些组件都定义在了 <i>components</i>  目录的 <i>A.jsx</i> 文件中。在没有重构思想的情况下，我们倾向于将<em>B</em> 和 <em>C</em> 分离到各自的<i>B.jsx</i> 和 <i>C.jsx</i>文件中：这就产生了两种选择：

<!-- - Create files <i>B.jsx</i> and <i>C.jsx</i> in the <i>components</i> directory. This results in the following structure: -->
- 在  <i>components</i> 文件夹中 创建 <i>B.jsx</i>和 <i>C.jsx</i> 两个文件，也就产生了如下的应用架构：

```
components/
  A.jsx
  B.jsx
  C.jsx
  ...
```

<!-- - Create a directory <i>A</i> in the <i>components</i> directory and create files <i>B.jsx</i> and <i>C.jsx</i> there. To avoid breaking components that import the <i>A.jsx</i> file, move the <i>A.jsx</i> file to the <i>A</i> directory and rename it to <i>index.jsx</i>. This results in the following structure: -->
- 在 <i>components</i>  文件夹中创建一个  <i>A</i> 文件夹， 并在里面创建<i>B.jsx</i> 和<i>C.jsx</i>  两个文件。为了避免破坏对<i>A.jsx</i> 的引入，将<i>A.jsx</i> 文件移动到 <i>A</i> 文件夹中，并重命名为 <i>index.jsx</i>。也就产生了如下的应用架构：

```
components/
  A/
    B.jsx
    C.jsx
    index.jsx
  ...
```

<!-- The first option is fairly decent, however, if components <em>B</em> and <em>C</em> are not reusable outside the component <em>A</em>, it is useless to bloat the <i>components</i> directory by adding them as separate files. The second option is quite modular and doesn't break any imports because importing a path such as <i>./A</i> will match both <i>A.jsx</i> and <i>A/index.jsx</i>. -->
第一个选择比较正统，但是如果组件 <em>B</em>和<em>C</em>  在 <em>A</em> 之外并没什么可复用的，那通过增加单独的文件而产生的对 <i>components</i> 文件夹的膨胀就显得没有必要。 第二个选项是有些模块化的，并不会破坏任何引入，因为像 <i>./A</i> 来引入刚好会同时引入 <i>A.jsx</i> 和<i>A/index.jsx</i>
</div>

<div class="tasks">

### Exercise 10.11.

#### Exercise 10.11: fetching repositories with Apollo Client
利用Apollo Client 来获得仓库列表

<!-- We want to replace the Fetch API implementation in the <em>useRepositories</em> hook with a GraphQL query. Open the GraphQL Playground at [http://localhost:5000/graphql](http://localhost:5000/graphql) and open to documentation by clicking the <i>docs</i> tab. Look up the <em>repositories</em> query. The query has some arguments, however, all of these are optional so you don't need to specify them. In the GraphQL Playground form a query for fetching the repositories with the fields you are currently displaying in the application. The result will be paginated and it contains the up to first 30 results by default. For now, you can ignore the pagination entirely. -->
我们希望利用 GraphQL query 在<em>useRepositories</em> 中替换Fetch API 的实现。 在  [http://localhost:5000/graphql](http://localhost:5000/graphql) 打开GraphQL Playground，并点击<i>docs</i>  tab页面打开文档。 查找<em>repositories</em> 的查询。该查询有一些蚕食，但是所有的参数都是可选的，不需要额外指定它们。在GraphQL Playground 中生成一个应用中用于展示信息的查询，包含仓库列表和其中对应的字段。结果是份好页的，默认包含了前30条记录。目前，你可以完全忽略分页技术。

<!-- Once the query is working in the GraphQL Playground, use it to replace the Fetch API implementation in the <em>useRepositories</em> hook. This can be achieved using the [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery) hook. The <em>gql</em> template literal tag can be imported from the Apollo Boost as instructed earlier. Consider using the structure recommended earlier for the GraphQL related code. To avoid future caching issues, use the _cache-and-network_ [fetch policy](https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy) in the query. It can be used with the <em>useQuery</em> hook like this: -->
一旦查询在GraphQL Playground 中运转良好，用它在 <em>useRepositories</em> hook中来替换掉 Fetch API 的实现。可以通过使用 [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery) hook 来达到这个目的。<em>gql</em> 模版语义标签可以按之前所讲的那样从Apollo Boost 中引入。考虑使用之前建议的应用架构来组织GraphQL 相关的代码。为了避免将来的缓存问题，在查询中使用 _cache-and-network_ [fetch policy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic) 。可以利用  <em>useQuery</em> hook 来搭配使用，用法如下：

```javascript
useQuery(MY_QUERY, {
  fetchPolicy: 'cache-and-network',
  // Other options
});
```

<!-- The changes in the <em>useRepositories</em> hook should not affect the <em>RepositoryList</em> component in any way. -->
无论怎样， 在 <em>useRepositories</em>  hook 中做的修改不应当影响到<em>RepositoryList</em>  组件。

</div>

<div class="content">

### Environment variables
环境变量

<!-- Every application will most likely run in more than one environment. Two obvious candidates for these environments are the development environment and the production environment. Out of these two, the development environment is the one we are running the application right now. Different environments usually have different dependencies, for example, the server we are developing locally might use a local database whereas the server that is deployed to the production environment uses the production database. To make the code environment independent we need to parametrize these dependencies. At the moment we are using one very environment dependant hardcoded value in our application: the URL of the server. -->

每个应用都很可能在不止一个环境中运行。两个最常见的环境便是开发环境和生产环境。除了这两个我们先不管其他的，开发环境是我们当前应用正在使用的。不同的环境中通常会有不同的依赖，比如说我们使用的服务端在本地运行时可能使用的是一个本地数据库而部署在生产环境的会使用生产数据库。为了使代码与环境独立，我们需要参数化这些依赖。目前来说我们使用的一个与环境强相关的一个硬编码就是：服务端的URL。

<!-- We have previously learned that we can provide running programs with environment variables. These variables can be defined in the command line or using environment configuration files such as <i>.env</i> files and third-party libraries such as <i>Dotenv</i>. Unfortunately, React Native doesn't have direct support for environment variables. However, we can access the Expo configuration defined in the <i>app.json</i> file at runtime from our JavaScript code. This configuration can be used define and access environment dependant variables. -->

如我们之前学到的我们可以为运行的程序提供环境变量。这些变量可以定义在启动命令，或者定义在环境配置文件中，比如说<i>.env</i> 文件或使用三方库 <i>Dotenv</i>。不幸的是， React Native 对环境变量并没有直接的支持。到那时我们可以利用JavaScript 代码在运行时访问Expo 配置，它定义在<i>app.json</i>  中。这个配置可以用来访问特定环境的变量。

<!-- The configuration can be accessed by importing the <em>Constants</em> constant from the <i>expo-constants</i> module as be have done a few times before. Once imported, the <em>Constants.manifest</em> property will contain the configuration. Let's try this by logging <em>Constants.manifest</em> in the <em>App</em> component: -->
这些配置可以从 <i>expo-constants</i> 模块通过引入<em>Constants</em> 常量，我们之前已经做过几次了。一旦引入， <em>Constants.manifest</em> 属性就会携带着配置。让我们通过在 <em>App</em> 组件中打印 <em>Constants.manifest</em>日志查看一下：

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks';
import Constants from 'expo-constants'; // highlight-line

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

const App = () => {
  console.log(Constants.manifest); // highlight-line

  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Main />
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
```

<!-- You should now see the configuration in the logs. -->
你现在应该可以看到日志中的配置信息了。

<!-- The next step is to use the configuration to define environment dependant variables in our application. Let's get started by renaming the <i>app.json</i> file to <i>app.config.js</i>. Once the file is renamed, we can use JavaScript inside the configuration file. Change the file contents so that the previous object: -->
下一步是在我们的应用中使用配置来定义环境独立的变量。我们首先将 <i>app.json</i> 文件重命名为 <i>app.config.js</i> 。 一旦文件重命名了，我们可以在配置文件中使用JavaScript。修改文件内容，之前的对象：

```javascript
{
  "expo": {
    "name": "rate-repository-app",
    // rest of the configuration...
  }
}
```

<!-- Is turned into and export, which contains the contents of the <em>expo</em> property: -->
将它export 出去，并携带着 <em>expo</em> 属性的内容：

```javascript
export default {
   name: 'rate-repository-app',
   // rest of the configuration...
};
```

<!-- Expo has reserved an [extra](https://docs.expo.io/guides/environment-variables/#using-app-manifest-extra) property in the configuration for any application-specific configuration. To see how this works, let's add a <em>env</em> variable into our application's configuration: -->
Expo 已经在配置中为一些应用相关的配置保留了一个[extra](https://docs.expo.io/guides/environment-variables/#using-app-manifest-extra)属性。我们通过在应用的配置中增加一个 <em>env</em>变量来看看这是怎么运作的。

```javascript
export default {
   name: 'rate-repository-app',
   // rest of the configuration...
   // highlight-start
   extra: {
     env: 'development'
   },
   // highlight-end
};
```

<!-- Restart Expo development tools to apply the changes and you should see that the value of <em>Constants.manifest</em> property has changed and now includes the <em>extra</em> property containing our application-specific configuration. Now the value of the <em>env</em> variable is accessible through the <em>Constants.manifest.extra.env</em> property. -->

重启 Expo 开发工具来生效这些变化，你会看到 <em>Constants.manifest</em> 属性已经变化了，并包含了 <em>extra</em> 属性，其中携带了我们应用相关的配置。现在 <em>env</em> 变量的值就可以通过 <em>Constants.manifest.extra.env</em> 属性来访问了。

<!-- Because using hard coded configuration is a bit silly, let's use an environment variable instead: -->
由于硬编码配置有点中二，让我们使用环境变量来替换一下吧：

```javascript
export default {
   name: 'rate-repository-app',
   // rest of the configuration...
   // highlight-start
   extra: {
     env: process.env.ENV,
   },
   // highlight-end
};
```

<!-- As we have learned, we can set the value of an environment variable through the command line by defining the variable's name and value before the actual command. As an example, start Expo development tools and set the environment variable <em>ENV</em> as <em>test</em> like this: -->
如我们之前学到的，我们可以在命令前定义变量的name 和value，然后通过命令行设置环境变量的值。作为一个样例，启动 Expo 开发工具，并将环境变量  <em>ENV</em> 的值设置成 <em>test</em> ：

```shell
ENV=test npm start
```

<!-- If you take a look at the logs, you should see that the <em>Constants.manifest.extra.env</em> property has changed. -->
如果你查看一眼日志，你能够看到 属性已经变了。

<!-- We can also load environment variables from a <em>.env</em> file as we have learned in the previous parts. First, we need to install the [Dotenv](https://www.npmjs.com/package/dotenv) library: -->
我们可以像之前章节学到的那样，从 <em>.env</em>文件中加载环境变量。首先我们需要安装 [Dotenv](https://www.npmjs.com/package/dotenv)库：

```shell
npm install dotenv
```

<!-- Next, add a <em>.env</em> file in the root directory of our project with the following content: -->
下一步，在我们项目的根目录添加 <em>.env</em>  文件，内容如下：

```
ENV=development
```

<!-- Finally, import the library in the <i>app.config.js</i> file: -->
最后，在 <i>app.config.js</i>  文件中引入库：

```javascript
import 'dotenv/config'; // highlight-line

export default {
   name: 'rate-repository-app',
   // rest of the configuration...
   extra: {
     env: process.env.ENV,
   },
};
```

<!-- You need to restart Expo development tools to apply the changes you have made to the <i>.env</i> file. -->
你需要重启Expo 开发工具来生效修改的<i>.env</i> 文件。

<!-- Note that it is <i>never</i> a good idea to put sensitive data into the application's configuration. The reason for this is that once a user has downloaded your application, they can, at least in theory, reverse engineer your application and figure out the sensitive data you have stored into the code. -->
注意，<i>永远不要</i>将敏感信息放到应用配置中。因为一旦用户下载到你的应用，它们可以，或者至少说理论上可以，逆向工程破解你的应用，并计算出你存到代码中的敏感信息。

</div>

<div class="tasks">

### Exercise 10.12.

#### Exercise 10.12: environment variables

<!-- Instead of the hardcoded Apollo Server's URL, use an environment variable defined in the <i>.env</i> file when initializing the Apollo Client. You can name the enviroment variable for example <em>APOLLO_URI</em>. -->
在Apollo Client 创建初始化时，使用 <i>.env</i> 文件中的环境变量，不要硬编码Apollo Server 的URL。你可以将它命名为一个环境变量，比如<em>APOLLO_URI</em>。

</div>

<div class="content">

### Storing data in the user's device
在用户设备中排序

<!-- There are times when we need to store some persisted pieces of data in the user's device. One such common scenario is storing the user's authentication token so that we can retrieve it even if the user closes and reopens our application. In web development, we have used the browser's <em>localStorage</em> object to achieve such functionality. React Native provides similar persistent storage, the [AsyncStorage](https://react-native-community.github.io/async-storage/docs/usage). -->
我们常常会将一些数据持久化到用户的设备中。一个典型的场景时存储用户的认证token ，这样我们在重新开启应用时就可以重复获取它。在Web 开发中，我们已经使用过浏览器的  <em>localStorage</em>  对象来实现相关的功能。React Native 提供了类似的持久化存储， 那就是[AsyncStorage](https://react-native-community.github.io/async-storage/docs/usage)。


<!-- We can use the <em>expo install</em> command to install the version of the <i>@react-native-community/async-storage</i> package that is suitable for our Expo SDK version: -->

我们可以使用<em>expo install</em> 命令来安装适合Expo SDK 版本的 <i>@react-native-community/async-storage</i> 安装包：

```shell
expo install @react-native-community/async-storage
```

<!-- The API of the <em>AsyncStorage</em> is in many ways same as the <em>localStorage</em> API. They are both key-value storages with similar methods. The biggest difference between the two is that, as the name implies, the operations of <em>AsyncStorage</em> are <i>asynchronous</i>. -->
<em>AsyncStorage</em> 的API 从某种意义上来说和  <em>localStorage</em>  的API相同。 他们都是KV存储，拥有类似的方法。最大的不同正如他们的名字所预示的， <em>AsyncStorage</em>  是 <i>异步的</i>。


<!-- Because <em>AsyncStorage</em> operates with string keys in a global namespace it is a good idea to create a simple abstraction for its operations. This abstraction can be implemented for example using a [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). As an example, we could implement a shopping cart storage for storing the products user wants to buy: -->
由于 <em>AsyncStorage</em> 对string key 的操作是全局的命名空间，因此对其操作进行一些简单的抽象是非常好的。这种抽象可以通过例如[class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 来完成。举个例子，我们可以实现一个购物车来存储用户希望购买的商品：

```javascript
import AsyncStorage from '@react-native-community/async-storage';

class ShoppingCartStorage {
  constructor(namespace = 'shoppingCart') {
    this.namespace = namespace;
  }

  async getProducts() {
    const rawProducts = await AsyncStorage.getItem(
      `${this.namespace}:products`,
    );

    return rawProducts ? JSON.parse(rawProducts) : [];
  }

  async addProduct(productId) {
    const currentProducts = await this.getProducts();
    const newProducts = [...currentProducts, productId];

    await AsyncStorage.setItem(
      `${this.namespace}:products`,
      JSON.stringify(newProducts),
    );
  }

  async clearProducts() {
    await AsyncStorage.removeItem(`${this.namespace}:products`);
  }
}

const doShopping = async () => {
  const shoppingCartA = new ShoppingCartStorage('shoppingCartA');
  const shoppingCartB = new ShoppingCartStorage('shoppingCartB');

  await shoppingCartA.addProduct('chips');
  await shoppingCartA.addProduct('soda');

  await shoppingCartB.addProduct('milk');

  const productsA = await shoppingCartA.getProducts();
  const productsB = await shoppingCartB.getProducts();

  console.log(productsA, productsB);

  await shoppingCartA.clearProducts();
  await shoppingCartB.clearProducts();
};

doShopping();
```

<!-- Because <em>AsyncStorage</em> keys are global, it is usually a good idea to add a <i>namespace</i> for the keys. In this context, the namespace is just a prefix we provide for the storage abstraction's keys. Using the namespace prevents the storage's keys from colliding with other <em>AsyncStorage</em> keys. In this example, the namespace is defined as the constructor's argument and we are using the <em>namespace:key</em> format for the keys. -->

由于 <em>AsyncStorage</em> 的key 是全局的，通常会为key添加一个 <i>namespace</i>。在本上下文中， namespace 就是我们提供存储抽象的key的前缀。使用namespace 来防止存储的key 与其他的 <em>AsyncStorage</em> key相冲突。在这个例子中， namespace 作为一个构造器参数，用形如  <em>namespace:key</em>  的格式来使用获得key。

<!-- We can add an item to the storage using the [AsyncStorage.setItem](https://github.com/react-native-community/async-storage/blob/master/docs/API.md#setItem) method. The first argument of the method is the item's key and the second argument its value. The value <i>must be a string</i>, so we need to serialize non-string values as we did with the <em>JSON.stringify</em> method. The [AsyncStorage.getItem](https://github.com/react-native-community/async-storage/blob/master/docs/API.md#getitem) method can be used to get an item from the storage. The argument of the method is the item's key, of which value will be resolved. The [AsyncStorage.removeItem](https://github.com/react-native-community/async-storage/blob/master/docs/API.md#removeitem) method can be used to remove the item with the provided key from the storage. -->

我们可以使用 [AsyncStorage.setItem](https://react-native-community.github.io/async-storage/docs/api#setitem) 来向存储添加存储项。方法的第一个参数是该项的key ，第二个参数是值。 值 <i>必须是字符串</i>， 所以我们需要序列化非字符串的值，就像我们使用  <em>JSON.stringify</em>  方法一样。 [AsyncStorage.getItem](https://react-native-community.github.io/async-storage/docs/api#getitem)  方法可以用来从存储中获得一个项。该方法的第一个参数是项目的key ， 这样它的值就被处理到了。 [AsyncStorage.removeItem](https://react-native-community.github.io/async-storage/docs/api#removeitem) 方法可以用来从storage 中移除相关的key 。

</div>

<div class="tasks">

### Exercises 10.13. - 10.14.

#### Exercise 10.13: the sign in form mutation
改变登录表单

<!-- The current implementation of the sign in form doesn't do much with the submitted user's credentials. Let's do something about that in this exercise. First, read the rate-repository-api server's [authorization documentation](https://github.com/fullstack-hy2020/rate-repository-api#-authorization) and test the provided queries in the GraphQL Playground. If the database doesn't have any users, you can populate the database with some seed data. Instructions for this can be found in the [getting started](https://github.com/fullstack-hy2020/rate-repository-api#-getting-started) section of the README. -->

当前对登录表单的实现并没有对用户的认证信息进行处理。 让我们在这个练习处理一下，首先读取 rate-repository-api 服务端的  [authorization documentation](https://github.com/fullstack-hy2020/rate-repository-api#-authorization) ，并在GraphQL Playground测试提供的查询。如果数据库没有任何用户，你可以使用一些测试数据生成到数据库中。这个操作的参考可以在  [getting started](https://github.com/fullstack-hy2020/rate-repository-api#-getting-started)  部分的README中看到。

<!-- Once you know how the authorization queries are supposed to work, create a file _useSignIn.js_ file in the <i>hooks</i> directory. In that file implement a <em>useSignIn</em> hook that sends the <em>authorize</em> mutation using the [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation) hook. Note that the <em>authorize</em> mutation has a <i>single</i> argument called <em>credentials</em>, which is of type <em>AuthorizeInput</em>. This [input type](https://graphql.org/graphql-js/mutations-and-input-types) contains <em>username</em> and <em>password</em> fields. -->

如果你知道认证查询是如何运用的，在<i>hooks</i> 文件夹中创建一个  _useSignIn.js_ 文件。 在文件中实现一个 <em>useSignIn</em>  hook ，能够使用 [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation)  hook发送 <em>authorize</em>  变化。注意 变化有一个 <i>唯一</i>的参数叫做  <em>credentials</em> ，是一种  <em>AuthorizeInput</em> 类型， 这种  [input type](https://graphql.org/graphql-js/mutations-and-input-types)  类型包含了 两个字段。

<!-- The return value of the hook should be a tuple <em>[signIn, result]</em> where <em>result</em> is the mutations result as it is returned by the <em>useMutation</em> hook and <em>signIn</em> a function that runs the mutation with a <em>{ username, password }</em> object argument. Hint: don't pass the mutation function to the return value directly. Instead, return a function that calls the mutation function like this: -->

该hook 的返回值应当是一个 <em>[signIn, result]</em> tuple ， <em>result</em> 是变化的结果，也就是  <em>useMutation</em>  hook 的返回， <em>signIn</em> 函数接收一个 对象参数来运行这个变化。提示： 不要直接将变化函数直接传递给返回值。

```javascript
const useSignIn = () => {
  const [mutate, result] = useMutation(/* mutation arguments */);

  const signIn = async ({ username, password }) => {
    // call the mutate function here with the right arguments
  };

  return [signIn, result];
};
```

<!-- Once the hook is implemented, use it in the <em>SignIn</em> component's <em>onSubmit</em> callback for example like this: -->
一旦这个hook 实现了，像如下使用 <em>SignIn</em> 组件的 <em>onSubmit</em> 回调函数：

```javascript
const SignIn = () => {
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  // ...
};
```

<!-- This exercise is completed once you can log the user's <i>authorize</i> mutations result after the sign in form has been submitted. The mutation result should contain the user's access token. -->
练习完成后你可以在登录表单提交后，就可以将用户的 <i>authorize</i> 信息打印出来。变化结果中应当包含了用户的访问 token。

#### Exercise 10.14: storing the access token step1
存储访问token 步骤1

<!-- Now that we can obtain the access token we need to store it. Create a file <i>authStorage.js</i> in the <i>utils</i> directory with the following content: -->
现在我们可以获取到需要存储的访问token 了。 在<i>utils</i>  文件夹中创建一个<i>authStorage.js</i>  文件，内容如下：

```javascript
import { AsyncStorage } from 'react-native';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  getAccessToken() {
    // Get the access token for the storage
  }

  setAccessToken(accessToken) {
    // Add the access token to the storage
  }

  removeAccessToken() {
    // Remove the access token from the storage
  }
}

export default AuthStorage;
```

<!-- Next, implement the methods <em>AuthStorage.getAccessToken</em>, <em>AuthStorage.setAccessToken</em> and <em>AuthStorage.removeAccessToken</em>. Use the <em>namespace</em> variable to give your keys a namespace like we did in the previous example. -->
下一步，实现 <em>AuthStorage.getAccessToken</em>, <em>AuthStorage.setAccessToken</em> 和 <em>AuthStorage.removeAccessToken</em> 三个方法，使用 <em>namespace</em> 变量来给你的key 一个命名空间，仿照之前的例子。

</div>

<div class="content">

### Enhancing Apollo Client's requests
增强Apollo 客户端的请求

<!-- Now that we have implemented storage for storing the user's access token, it is time to start using it. Initialize the storage in the <em>App</em> component: -->
现在我们已经实现了存储用户访问token 的存储功能，是时候展现真正的技术了。在 <em>App</em> 组件中初始化存储。

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage'; // highlight-line

const authStorage = new AuthStorage(); // highlight-line
const apolloClient = createApolloClient(authStorage); // highlight-line

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Main />
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
```

<!-- We also provided the storage instance for the <em>createApolloClient</em> function as an argument. This is because next, we will send the access token to Apollo Server in each request. The Apollo Server will expect that the access token is present in the <i>Authorization</i> header in the format <i>Bearer <ACCESS_TOKEN></i>. We can enhance the Apollo Client's operation by using the [request](https://www.apollographql.com/docs/react/get-started/#configuration-options) option. Let's send the access token to the Apollo Server in our Apollo Client by modifying the <em>createApolloClient</em> function in the <i>apolloClient.js</i> file: -->
我们同时为 <em>createApolloClient</em> 函数作为参数提供了存储实例。因为下一步，我们在每一次请求时，要将访问token 发送到Apollo Server。Apollo Server 会假定访问tokens 存在于 <i>Authorization</i> 头中，格式为  <i>Bearer <ACCESS_TOKEN></i> 。 我们可以通过使用 [request](https://www.apollographql.com/docs/react/get-started/#configuration-options) 选项来增强Apollo 客户端的操作。让我们在Apollo Client 中改变 <i>apolloClient.js</i>文件中的 <em>createApolloClient</em> 函数来发送访问token：

```javascript
const createApolloClient = (authStorage) => { // highlight-line
  return new ApolloClient({
    // highlight-start
    request: async (operation) => {
      try {
        const accessToken = await authStorage.getAccessToken();

        operation.setContext({
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    // highlight-end
    // uri and other options...
  });
};
```

### Using React Context for dependency injection
使用React 上下文依赖注入

<!-- The last piece of the sign-in puzzle is to integrate the storage to the <em>useSignIn</em> hook. To achieve this the hook must be able to access token storage instance we have initialized in the <em>App</em> component. React [Context](https://reactjs.org/docs/context.html) is just the tool we need for the job. Create a directory <i>contexts</i> in the <i>src</i> directory. In that directory create a file <i>AuthStorageContext.js</i> with the following content: -->
登录功能的最后一块拼图是将存储整合到  <em>useSignIn</em> hook 中。为了达到这个目的，hook 必须能够访问我们在 <em>App</em> 组件中初始化的存储实例中。React  [Context](https://reactjs.org/docs/context.html) 恰巧是我们完成这项功能的工具。 在 <i>src</i> 文件夹中创建一个 y <i>contexts</i> 目录。在文件夹中创建一个 <i>AuthStorageContext.js</i>  文件，包含以下内容：

```javascript
import React from 'react';

const AuthStorageContext = React.createContext();

export default AuthStorageContext;
```

<!-- Now we can use the <em>AuthStorageContext.Provider</em> to provide the storage instance to the descendants of the context. Let's add it to the <em>App</em> component: -->
现在我们可以使用<em>AuthStorageContext.Provider</em>来为上下文后台提供存储实例了。让我们将它放到 <em>App</em> 组件中：

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext'; // highlight-line

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <AuthStorageContext.Provider value={authStorage}> // highlight-line
          <Main />
        </AuthStorageContext.Provider> // highlight-line
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
```

<!-- Accessing the storage instance in the <em>useSignIn</em> hook is now possible using the React's [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) hook like this: -->
现在就可以使用React 的 [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) 在 <em>useSignIn</em> hook 中访问存储实例了，hook 内容如下：

```javascript
import { useContext } from 'react'; // highlight-line
// ...

import AuthStorageContext from '../contexts/AuthStorageContext'; //highlight-line

const useSignIn = () => {
  const authStorage = useContext(AuthStorageContext); //highlight-line
  // ...
};
```

<!-- Note that accessing a context's value using the <em>useContext</em> hook only works if the <em>useContext</em> hook is used in a component that is a <i>descendant</i> of the [Context.Provider](https://reactjs.org/docs/context.html#contextprovider) component. -->
注意使用 <em>useContext</em> hook 访问上下文的值仅仅在该组件使用<em>useContext</em> hook ，且该组件是  [Context.Provider](https://reactjs.org/docs/context.html#contextprovider) 组件的子组件时生效。

<!-- The ability to provide data to component's descendants opens tons of use cases for React Context. To learn more about these use cases, read Kent C. Dodds' enlightening article [How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively) to find out how to combine the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook with the context to implement state management. You might find a way to use this knowledge in the upcoming exercises. -->
能够向组件的后代提供数据，这个能力对React Context 来说有大量的用例。如果想学习更多关于这些的用例，可以阅读 Kent C. Dodds 的启发式文章，[How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)，可以习得如何结合[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook 与上下文来实现状态管理。你在接下来的练习中可能会用到这个知识。

</div>

<div class="tasks">

### Exercises 10.15. - 10.16.

#### Exercise 10.15: storing the access token step2
存储访问token 步骤2

<!-- Improve the <em>useSignIn</em> hook so that it stores the user's access token retrieved from the <i>authorize</i> mutation. The return value of the hook should not change. The only change you should make to the <em>SignIn</em> component is that you should redirect the user to the reviewed repositories list view after a successful sign in. You can achieve this by using the (useHistory)[https://reacttraining.com/react-router/native/api/Hooks/usehistory] hook and the history's [push](https://reacttraining.com/react-router/native/api/history) method. -->
改进<em>useSignIn</em> hook ，使之能存储从<i>authorize</i>  变化来的用户的访问token。hook 的返回值不能变化，对 <em>SignIn</em>组件唯一的变化应当是在用户成功登录后将起重定向到用户已评论的仓库列表视图。你可以使用[useHistory](https://reacttraining.com/react-router/native/api/Hooks/usehistory) hook 和history 的[push](https://reacttraining.com/react-router/native/api/history) 方法 来完成这个功能。

<!-- After the <i>authorize</i> mutation has been executed and you have stored the user's access token to the storage, you should reset the Apollo Client's store. This will clear the Apollo Client's cache and re-execute all active queries. You can do this by using the Apollo Client's [resetStore](https://www.apollographql.com/docs/react/v2.5/api/apollo-client/#ApolloClient.resetStore) method. You can access the Apollo Client in the <em>useSignIn</em> hook using the [useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient) hook. Note that the order of the execution is crucial and should be the following: -->

在 <i>认证</i> 变化执行后，并且你已经存储了用户的访问token，你可以重置Apollo Client 的存储了。这会清空Apollo Client 的缓存，并重新执行所有活跃的查询。你可以利用Apollo Client 的 [resetStore](https://www.apollographql.com/docs/react/v2.5/api/apollo-client/#ApolloClient.resetStore) 方法，并在 <em>useSignIn</em> hook 中使用 [useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient) hook 来访问Apollo Client 。注意执行的顺序至关重要，它应该看起来像这样：

```javascript
const { data } = await mutate(/* options */);
await authStorage.setAccessToken(/* access token from the data */);
apolloClient.resetStore();
```

#### Exercise 10.16: sign out
登出

<!-- The final step in completing the sign in feature is to implement a sign out feature. The <em>authorizedUser</em> query can be used to check the authorized user's information. If the query's result is <em>null</em>, that means that the user is not authorized. Open the GraphQL playground and run the following query: -->
完成登录特性的最后一步就是登出功能。 <em>authorizedUser</em> 查询能够用来检查验证的用户信息，如果查询结果为 <em>null</em> ， 也就意味着用户没有被认证。打开GraphQL playground 并运行如下查询：

```javascript
{
  authorizedUser {
    id
    username
  }
}
```

<!-- You will probably end up with the <em>null</em> result. This is because the GraphQL Playground is not authorized, meaning that it doesn't send a valid access token with the request. Revise the [authorization documentation](https://github.com/fullstack-hy2020/rate-repository-api#-authorization) and retrieve an access token using the <em>authorize</em> mutation. Use this access token in the _Authorization_ header as instructed in the documentation. Now, run the <em>authorizedUser</em> query again and you should be able to see the authorized user's information. -->
你可能最终的结果为 <em>null</em> 。 这是因为GraphQL Playground 并没有验证，也就是说它在请求中没有发送一个合法的访问token。 复习 [authorization documentation](https://github.com/fullstack-hy2020/rate-repository-api#-authorization)， 并使用 <em>authorize</em> 变化来获取访问token。按照指导文档使用这个访问token放到  _Authorization_  头中。现在，再次运行  <em>authorizedUser</em> 查询，你应当能够看到认证的用户信息了。

<!-- Open the <em>AppBar</em> component in the <i>AppBar.jsx</i> file where you currently have the tabs "Repositories" and "Sign in". Change the tabs so that if the user is signed in the tab "Sign out" is displayed, otherwise show the "Sign in" tab. You can achieve this by using the <em>authorizedUser</em> query with the [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery) hook. -->
打开 <i>AppBar.jsx</i> 文件的 <em>AppBar</em>  组件，现在组件里有 "Repositories" 和 "Sign in"两个tab页。修改tab页，当用户登录后，显示 “登出” tab 页，否则展示 “登录” tab 页。你可以使用 <em>authorizedUser</em> 查询配合 [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery) hook来完成这个功能。

<!-- Pressing the "Sign out" tab should remove the user's access token from the storage and reset the Apollo Client's store with the [resetStore](https://www.apollographql.com/docs/react/v2.5/api/apollo-client/#ApolloClient.resetStore) method. Calling the <em>resetStore</em> method should automatically re-execute all active queries which means that the <em>authorizedUser</em> query should be re-executed. Note that the order of execution is crucial: access token must be removed from the storage <i>before</i> the Apollo Client's store is reset. -->
点击“登出” tab 应当从存储中删除用户的访问token，并利用[resetStore](https://www.apollographql.com/docs/react/v2.5/api/apollo-client/#ApolloClient.resetStore) 方法重置Apollo Client 的存储。 调用  <em>resetStore</em> 方法会自动重新执行所有活跃的查询，也就意味着 <em>authorizedUser</em>  查询应当被重新执行了。注意执行的顺序至关重要，访问token从存储中删除必须 <i>优先于</i> Apollo Client 存储重置。

This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Note that exercises in this section should be submitted to the part 3 in the exercise submission system.

这是该节的最后一个练习。是时候将自己的代码提交到Github 并在[exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020) 中，将完成的练习标注为已完成。注意本节的练习应当提交到练习提交系统的第三节中。
</div>
