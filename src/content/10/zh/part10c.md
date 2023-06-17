---
mainImage: ../../../images/part-10.svg
part: 10
letter: c
lang: zh
---

<div class="content">

<!-- So far we have implemented features to our application without any actual server communication. For example, the reviewed repositories list we have implemented uses mock data and the sign in form doesn't send the user's credentials to any authentication endpoint. In this section, we will learn how to communicate with a server using HTTP requests, how to use Apollo Client in a React Native application, and how to store data in the user's device.-->
 到目前为止，我们已经在没有任何实际服务器通信的情况下对我们的应用实现了一些功能。例如，我们实现的已审查的存储库列表使用了模拟数据，而且登录表单没有将用户的凭证发送到任何认证终端。在本节中，我们将学习如何使用HTTP请求与服务器通信，如何在React Native应用中使用Apollo客户端，以及如何在用户的设备中存储数据。

<!-- Soon we will learn how to communicate with a server in our application. Before we get to that, we need a server to communicate with. For this purpose, we have a completed server implementation in the [rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api) repository. The rate-repository-api server fulfills all our application's API needs during this part. It uses [SQLite](https://www.sqlite.org/index.html) database which doesn't need any setup and provides an Apollo GraphQL API along with a few REST API endpoints.-->
 很快我们将学习如何在我们的应用中与服务器通信。在这之前，我们需要一个服务器来进行通信。为此，我们在[rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api)仓库中有一个完整的服务器实现。在这一部分，rate-repository-api服务器满足了我们应用的所有API需求。它使用[SQLite](https://www.sqlite.org/index.html)数据库，不需要任何设置，并提供一个Apollo GraphQL API和一些REST API端点。

<!-- Before heading further into the material, set up the rate-repository-api server by following the setup instructions in the repository's [README](https://github.com/fullstack-hy2020/rate-repository-api/blob/master/README.md). Note that if you are using an emulator for development it is recommended to run the server and the emulator <i>on the same computer</i>. This eases network requests considerably.-->
 在进一步了解材料之前，请按照版本库的[README](https://github.com/fullstack-hy2020/rate-repository-api/blob/master/README.md)中的设置说明来设置rate-repository-api服务器。注意，如果你使用模拟器进行开发，建议将服务器和模拟器<i>运行在同一台电脑上</i>。这样可以大大缓解网络请求。

### HTTP requests

<!-- React Native provides [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making HTTP requests in our applications. React Native also supports the good old [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) which makes it possible to use third-party libraries such as [Axios](https://github.com/axios/axios). These APIs are the same as the ones in the browser environment and they are globally available without the need for an import.-->
 React Native提供了[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)用于在我们的应用中进行HTTP请求。React Native还支持古老的[XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)，这使得我们可以使用第三方库，如[Axios](https://github.com/axios/axios)。这些API与浏览器环境中的API是一样的，它们是全局可用的，不需要导入。

<!-- People who have used both Fetch API and XMLHttpRequest API most likely agree that the Fetch API is easier to use and more modern. However, this doesn't mean that XMLHttpRequest API doesn't have its uses. For the sake of simplicity, we will be only using the Fetch API in our examples.-->
同时使用过Fetch API和XMLHttpRequest API的人很可能同意，Fetch API更容易使用，也更现代。然而，这并不意味着XMLHttpRequest API没有它的用途。为了简单起见，我们将在我们的例子中只使用Fetch API。

<!-- Sending HTTP requests using the Fetch API can be done using the <em>fetch</em> function. The first argument of the function is the URL of the resource:-->
 使用Fetch API发送HTTP请求可以通过<em>fetch</em>函数完成。该函数的第一个参数是资源的URL。

```javascript
fetch('https://my-api.com/get-end-point');
```

<!-- The default request method is <i>GET</i>. The second argument of the <em>fetch</em> function is an options object, which you can use to for example to specify a different request method, request headers, or request body:-->
 默认的请求方法是<i>GET</i>。<em>fetch</em>函数的第二个参数是一个选项对象，你可以用它来指定一个不同的请求方法、请求头或请求体。

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

<!-- Note that these URLs are made up and won't (most likely) send a response to your requests. In comparison to Axios, the Fetch API operates on a bit lower level. For example, there isn't any request or response body serialization and parsing. This means that you have to for example set the <i>Content-Type</i> header by yourself and use <em>JSON.stringify</em> method to serialize the request body.-->
 注意，这些URL是编造的，不会（很可能）对你的请求发出响应。与Axios相比，Fetch API的操作水平要低一些。例如，没有任何请求或响应体的序列化和解析。这意味着你必须自己设置<i>Content-Type</i>头并使用<em>JSON.stringify</em>方法来序列化请求体。

<!-- The <em>fetch</em> function returns a promise which resolves a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. Note that error status codes such as 400 and 500 <i>are not rejected</i> like for example in Axios. In case of a JSON formatted response we can parse the response body using the <em>Response.json</em> method:-->
 <em>fetch</em>函数返回一个承诺，它解决了一个[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象。请注意，错误状态代码如400和500 <i>不会被拒绝</i>，例如在Axios中。如果是JSON格式的响应，我们可以使用<em>Response.json</em>方法解析响应体。

```javascript
const fetchMovies = async () => {
  const response = await fetch('https://reactnative.dev/movies.json');
  const json = await response.json();

  return json;
};
```

<!-- For a more detailed introduction to the Fetch API, read the [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) article in the MDN web docs.-->
 关于Fetch API的更详细介绍，请阅读MDN网络文档中的[使用Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)文章。

<!-- Next, let's try the Fetch API in practice. The rate-repository-api server provides an endpoint for returning a paginated list of reviewed repositories. Once the server is running, you should be able to access the endpoint at [http://localhost:5000/api/repositories](http://localhost:5000/api/repositories). The data is paginated in a common [cursor based pagination format](https://graphql.org/learn/pagination/). The actual repository data is behind the <i>node</i> key in the <i>edges</i> array.-->
 接下来，让我们在实践中尝试Fetch API。Rate-repository-api 服务器提供了一个端点，用于返回一个分页的已审核仓库的列表。一旦服务器运行，你应该能够访问[http://localhost:5000/api/repositories](http://localhost:5000/api/repositories)这个端点。数据是以常见的[基于游标的分页格式](https://graphql.org/learn/pagination/)分页的。实际的存储库数据在<i>node</i>键后面的<i>edges</i>阵列中。

<!-- Unfortunately, we can't access the server directly in our application by using the <i>http://localhost:5000/api/repositories</i> URL. To make a request to this endpoint in our application we need to access the server using its IP address in its local network. To find out what it is, open the Expo development tools by running <em>npm start</em>. In the development tools you should be able to see an URL starting with <i>exp://</i> above the QR code:-->
 不幸的是，我们不能通过使用<i>http://localhost:5000/api/repositories</i> URL在我们的应用中直接访问该服务器。为了在我们的应用中向这个端点发出请求，我们需要使用其本地网络中的IP地址访问服务器。要知道它是什么，通过运行<em>npm start</em>打开Expo开发工具。在开发工具中，你应该能够看到二维码上面有一个以<i>exp://</i>开头的URL。

![Development tools](../../images/10/10.png)

<!-- Copy the IP address between the <i>exp://</i> and <i>:</i>, which is in this example <i>192.168.100.16</i>. Construct an URL in format <i>http://<IP_ADDRESS>:5000/api/repositories</i> and open it in the browser. You should see the same response as you did with the <i>localhost</i> URL.-->
 复制<i>exp://</i>和<i>:</i>之间的IP地址，在这个例子中是<i>192.168.100.16</i>。构建一个格式为<i>http://<IP_ADDRESS>:5000/api/repositories</i>的URL，并在浏览器中打开它。你应该看到与<i>localhost</i> URL相同的响应。

<!-- Now that we know the end point's URL let's use the actual server-provided data in our reviewed repositories list. We are currently using mock data stored in the <em>repositories</em> variable. Remove the <em>repositories</em> variable and replace the usage of the mock data with this piece of code in the <i>RepositoryList.jsx</i> file in the <i>components</i> directory:-->
 现在我们知道了端点的URL，让我们在审查的存储库列表中使用服务器提供的实际数据。我们目前正在使用存储在<em>repositories</em>变量中的模拟数据。删除<em>repositories</em>变量，用<i>components</i>目录下的<i>RepositoryList.jsx</i>文件中的这段代码替换模拟数据的使用。

```javascript
import { useState, useEffect } from 'react';
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

<!-- We are using the React's <em>useState</em> hook to maintain the repository list state and the <em>useEffect</em> hook to call the <em>fetchRepositories</em> function when the <em>RepositoryList</em> component is mounted. We extract the actual repositories into the <em>repositoryNodes</em> variable and replace the previously used <em>repositories</em> variable in the <em>FlatList</em> component's <em>data</em> prop with it. Now you should be able to see actual server-provided data in the reviewed repositories list.-->
 我们使用React的<em>useState</em>钩子来维护存储库列表状态，并使用<em>useEffect</em>钩子在<em>RepositoryList</em>组件被安装时调用<em>fetchRepositories</em>函数。我们将实际的存储库提取到<em>repositoryNodes</em>变量中，并用它替换<em>FlatList</em>组件<em>data</em>prop中先前使用的<em>repositories</em>变量。现在你应该能够在审查的存储库列表中看到实际的服务器提供的数据。

<!-- It is usually a good idea to log the server's response to be able to inspect it as we did in the <em>fetchRepositories</em> function. You should be able to see this log message in the Expo development tools if you navigate to your device's logs as we learned in the [Viewing logs](/en/part10/introduction_to_react_native#viewing-logs) section. If you are using the Expo's mobile app for development and the network request is failing, make sure that the computer you are using to run the server and your phone are <i>connected to the same Wi-Fi network</i>. If that's not possible either use an emulator in the same computer as the server is running in or set up a tunnel to the localhost, for example, using [Ngrok](https://ngrok.com/).-->
 记录服务器的响应通常是个好主意，以便能够像我们在<em>fetchRepositories</em>函数中那样检查它。如果你像我们在[查看日志](/en/part10/introduction_to_react_native#viewing-logs)一节中学到的那样，导航到设备的日志，你应该能够在Expo开发工具中看到这个日志信息。如果你使用世博会的移动应用进行开发，并且网络请求失败，请确保你用来运行服务器的电脑和你的手机都<i>连接到同一个Wi-Fi网络</i>。如果这是不可能的，要么在服务器运行的同一台电脑上使用模拟器，要么设置一个隧道到本地主机，例如，使用[Ngrok](https://ngrok.com/)。

<!-- The current data fetching code in the </em>RepositoryList</em> component could do with some refactoring. For instance, the component is aware of the network request's details such as the end point's URL. In addition, the data fetching code has lots of reuse potential. Let's refactor the component's code by extract the data fetching code into its own hook. Create a directory <i>hooks</i> in the <i>src</i> directory and in that <i>hooks</i> directory create a file <i>useRepositories.js</i> with the following content:-->
 目前在</em>RepositoryList</em>组件中的数据获取代码可以做一些重构。例如，该组件知道网络请求的细节，如终端的URL。此外，获取数据的代码有很多重用的可能性。让我们重构该组件的代码，将数据获取代码提取到它自己的钩子中。在<i>src</i>目录下创建一个<i>hooks</i>目录，在该<i>hooks</i>目录下创建一个<i>useRepositories.js</i>文件，内容如下。

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

<!-- Now that we have a clean abstraction for fetching the reviewed repositories, let's use the <em>useRepositories</em> hook in the <em>RepositoryList</em> component:-->
 现在我们有了一个干净的抽象来获取审查过的仓库，让我们在<em>RepositoryList</em>组件中使用<em>useRepositories</em>钩子。

```javascript
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

<!-- That's it, now the <em>RepositoryList</em> component is no longer aware of the way the repositories are acquired. Maybe in the future, we will acquire them through a GraphQL API instead of a REST API. We will see what happens.-->
 就这样，现在<em>RepositoryList</em>组件不再知道获取存储库的方式。也许在未来，我们会通过GraphQL API而不是REST API来获取它们。我们将看看会发生什么。

### GraphQL and Apollo client

<!-- In [part 8](https://fullstackopen.com/en/part8) we learned about GraphQL and how to send GraphQL queries to an Apollo Server using the [Apollo Client](https://www.apollographql.com/docs/react/) in React applications. The good news is that we can use the Apollo Client in a React Native application exactly as we would with a React web application.-->
 在[第8章节](https://fullstackopen.com/en/part8)中，我们了解了GraphQL以及如何在React应用中使用[Apollo客户端](https://www.apollographql.com/docs/react/)将GraphQL查询发送到Apollo服务器。好消息是，我们可以在React Native应用中使用Apollo客户端，就像我们在React Web应用中一样。

<!-- As mentioned earlier, the rate-repository-api server provides a GraphQL API which is implemented with Apollo Server. Once the server is running, you can access the [Apollo Sandbox](https://www.apollographql.com/docs/studio/explorer/) at [http://localhost:4000](http://localhost:4000). Apollo Sandbox is a tool for making GraphQL queries and inspecting the GraphQL APIs schema and documentation. If you need to send a query in your application <i>always</i> test it with the Apollo Sandbox first before implementing it in the code. It is much easier to debug possible problems in the query in the Apollo Sandbox than in the application. If you are uncertain what the available queries are or how to use them, you can see the documentation next to the operations editor:-->
 如前所述，rate-repository-api服务器提供了一个GraphQL API，它是用Apollo服务器实现的。一旦服务器运行，你可以在[http://localhost:4000](https://www.apollographql.com/docs/studio/explorer/)访问[Apollo沙盒]。Apollo Sandbox是一个用于进行GraphQL查询和检查GraphQL APIs模式和文档的工具。如果你需要在你的应用中发送一个查询，<i>总是</i>在代码中实施之前先用Apollo Sandbox测试。在Apollo沙盒中调试查询中可能出现的问题要比在应用中调试容易得多。如果你不确定有哪些可用的查询或如何使用它们，你可以查看操作编辑器旁边的文档。

![Apollo Sandbox](../../images/10/11.png)

<!-- In our React Native application, we will be using the same [@apollo/client](https://www.npmjs.com/package/@apollo/client) library as in part 8. Let's get started by installing the library along with the [graphql](https://www.npmjs.com/package/graphql) library which is required as a peer dependency:-->
 在我们的React Native应用中，我们将使用与第八章节相同的[@apollo/client](https://www.npmjs.com/package/@apollo/client)库。让我们开始安装这个库和[graphql](https://www.npmjs.com/package/graphql)库，它是作为一个对等依赖的需要。

```shell
npm install @apollo/client graphql
```

<!-- Before we can start using Apollo Client, we will need to slightly configure the Metro bundler so that it handles the <i>.cjs</i> file extensions used by the Apollo Client. First, let's install the <i>@expo/metro-config</i> package which has the default Metro configuration:-->
 在我们开始使用Apollo客户端之前，我们需要稍微配置一下Metro捆绑器，以便它能处理Apollo客户端使用的<i>.cjs</i>文件扩展。首先，让我们安装<i>@expo/metro-config</i>包，它有默认的Metro配置。

```shell
npm install @expo/metro-config
```

<!-- Then, we can add the following configuration to a <i>metro.config.js</i> in the root directory of our project:-->
 然后，我们可以在项目根目录下的<i>metro.config.js</i>中添加以下配置。

```javascript
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
```

<!-- Restart the Expo development tools so that changes in the configuration are applied.-->
 重新启动Expo开发工具，以便配置中的变化被应用。

<!-- Now that the Metro configuration is in order, let's create a utility function for creating the Apollo Client with the required configuration. Create a <i>utils</i> directory in the <i>src</i> directory and in that <i>utils</i> directory create a file <i>apolloClient.js</i>. In that file configure the Apollo Client to connect to the Apollo Server:-->
 现在Metro配置已经就绪，让我们创建一个实用的函数，用所需的配置创建Apollo客户端。在<i>src</i>目录下创建一个<i>utils</i>目录，在该<i>utils</i>目录下创建一个<i>apolloClient.js</i>文件。在该文件中配置Apollo客户端以连接到Apollo服务器。

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  // Replace the IP address part with your own IP address!
  uri: 'http://192.168.100.16:4000/graphql',
});

const createApolloClient = () => {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
```

<!-- The URL used to connect to the Apollo Server is otherwise the same as the one you used with the Fetch API expect the port is <i>4000</i> and the path is <i>/graphql</i>. Lastly, we need to provide the Apollo Client using the [ApolloProvider](https://www.apollographql.com/docs/react/api/react/hooks/#the-apolloprovider-component) context. We will add it to the <em>App</em> component in the <i>App.js</i> file:-->
 用于连接Apollo服务器的URL与你在Fetch API中使用的URL相同，期望端口为<i>4000</i>，路径为<i>/graphql</i>。最后，我们需要使用[ApolloProvider](https://www.apollographql.com/docs/react/api/react/hooks/#the-apolloprovider-component) 上下文提供Apollo客户端。我们将把它添加到<i>App.js</i>文件中的<em>App</em>组件。

```javascript
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client'; // highlight-line

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

<!-- It is up to you how to organize the GraphQL related code in your application. However, for the sake of a reference structure, let's have a look at one quite simple and efficient way to organize the GraphQL related code. In this structure, we define queries, mutations, fragments, and possibly other entities in their own files. These files are located in the same directory. Here is an example of the structure you can use to get started:-->
 在你的应用中如何组织GraphQL相关的代码，这取决于你。然而，为了有一个参考结构，让我们看看一个相当简单和有效的方法来组织GraphQL相关的代码。在这个结构中，我们在自己的文件中定义查询、改变、片段，可能还有其他实体。这些文件都位于同一个目录下。下面是一个结构的例子，你可以用它来开始。

![GraphQL structure](../../images/10/12.png)

<!-- You can import the <em>gql</em> template literal tag used to define GraphQL queries from <i>@apollo/client</i> library. If we follow the structure suggested above, we could have a <i>queries.js</i> file in the <i>graphql</i> directory for our application's GraphQL queries. Each of the queries can be stored in a variable and exported like this:-->
 你可以从<i>@apollo/client</i>库导入用于定义GraphQL查询的<em>gql</em>模板字面标签。如果我们按照上面建议的结构，我们可以在<i>graphql</i>目录下有一个<i>queries.js</i>文件，用于我们应用的GraphQL查询。每个查询都可以存储在一个变量中，并像这样导出。

```javascript
import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      ${/* ... */}
    }
  }
`;

// other queries...
```

<!-- We can import these variables and use them with the <em>useQuery</em> hook like this:-->
 我们可以导入这些变量，并像这样用<em>useQuery</em>挂钩来使用它们。

```javascript
import { useQuery } from '@apollo/client';

import { GET_REPOSITORIES } from '../graphql/queries';

const Component = () => {
  const { data, error, loading } = useQuery(GET_REPOSITORIES);
  // ...
};
```

<!-- The same goes for organizing mutations. The only difference is that we define them in a different file, <i>mutations.js</i>. It is recommended to use [fragments](https://www.apollographql.com/docs/react/data/fragments/) in queries to avoid retyping the same fields over and over again.-->
 组织改变的情况也是如此。唯一的区别是我们在一个不同的文件中定义它们，<i>mutations.js</i>。建议在查询中使用[fragments](https://www.apollographql.com/docs/react/data/fragments/)，以避免重复输入相同的字段。

### Evolving the structure

<!-- Once our application grows larger there might be times when certain files grow too large to manage. For example, we have component <em>A</em> which renders the components <em>B</em> and <em>C</em>. All these components are defined in a file <i>A.jsx</i> in a <i>components</i> directory. We would like to extract components <em>B</em> and <em>C</em> into their own files <i>B.jsx</i> and <i>C.jsx</i> without major refactors. We have two options:-->
 一旦我们的应用变大，有时可能会出现某些文件变大而无法管理。例如，我们有组件<em>A</em>，它渲染了组件<em>B</em>和<em>C</em>。所有这些组件都定义在<i>A.jsx</i>目录下的<i>components</i>文件中。我们想把组件<em>B</em>和<em>C</em>提取到它们自己的文件<i>B.jsx</i>和<i>C.jsx</i>中，而无需进行重大的重构。我们有两个选择。

<!-- - Create files <i>B.jsx</i> and <i>C.jsx</i> in the <i>components</i> directory. This results in the following structure:-->
 - 在<i>components</i>目录下创建文件<i>B.jsx</i>和<i>C.jsx</i>。这将导致以下结构。

```
components/
  A.jsx
  B.jsx
  C.jsx
  ...
```

<!-- - Create a directory <i>A</i> in the <i>components</i> directory and create files <i>B.jsx</i> and <i>C.jsx</i> there. To avoid breaking components that import the <i>A.jsx</i> file, move the <i>A.jsx</i> file to the <i>A</i> directory and rename it to <i>index.jsx</i>. This results in the following structure:-->
 - 在<i>components</i>目录下创建一个目录<i>A</i>，并在那里创建文件<i>B.jsx</i>和<i>C.jsx</i>。为了避免破坏导入<i>A.jsx</i>文件的组件，将<i>A.jsx</i>文件移至<i>A</i>目录，并将其重命名为<i>index.jsx</i>。这样就形成了以下结构。

```
components/
  A/
    B.jsx
    C.jsx
    index.jsx
  ...
```

<!-- The first option is fairly decent, however, if components <em>B</em> and <em>C</em> are not reusable outside the component <em>A</em>, it is useless to bloat the <i>components</i> directory by adding them as separate files. The second option is quite modular and doesn't break any imports because importing a path such as <i>./A</i> will match both <i>A.jsx</i> and <i>A/index.jsx</i>.-->
 第一种方案相当得体，然而，如果组件<em>B</em>和<em>C</em>在组件<em>A</em>之外不能重复使用，那么将它们作为单独的文件加入到<i>组件</i>目录中，使之膨胀是没有用的。第二种方案是相当模块化的，并且不会破坏任何导入，因为导入诸如<i>./A</i>的路径会同时匹配<i>A.jsx</i>和<i>A/index.jsx</i>。

</div>

<div class="tasks">

### Exercise 10.11.

#### Exercise 10.11: fetching repositories with Apollo Client

<!-- We want to replace the Fetch API implementation in the <em>useRepositories</em> hook with a GraphQL query. Open the Apollo Sandbox at [http://localhost:4000](http://localhost:4000) and take a look at the documentation next to the operations editor. Look up the <em>repositories</em> query. The query has some arguments, however, all of these are optional so you don't need to specify them. In the Apollo Sandbox form a query for fetching the repositories with the fields you are currently displaying in the application. The result will be paginated and it contains the up to first 30 results by default. For now, you can ignore the pagination entirely.-->
 我们想用GraphQL查询取代<em>useRepositories</em>钩中的Fetch API实现。在[http://localhost:4000](http://localhost:4000)打开Apollo沙盒，看一下操作编辑器旁边的文档。查一下<em>repositories</em>查询。该查询有一些参数，然而，所有这些参数都是可选的，所以你不需要指定它们。在Apollo沙盒中形成一个查询，以获取你目前在应用中显示的字段的存储库。结果将被分页，默认情况下，它最多包含前30个结果。现在，你可以完全忽略分页。

<!-- Once the query is working in the Apollo Sandbox, use it to replace the Fetch API implementation in the <em>useRepositories</em> hook. This can be achieved using the [useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery) hook. The <em>gql</em> template literal tag can be imported from the <i>@apollo/client</i> library as instructed earlier. Consider using the structure recommended earlier for the GraphQL related code. To avoid future caching issues, use the _cache-and-network_ [fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy) in the query. It can be used with the <em>useQuery</em> hook like this:-->
 一旦查询在Apollo沙盒中工作，用它来替换<em>useRepositories</em>钩中的Fetch API实现。这可以通过[useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery)挂钩实现。<em>gql</em>模板字面标签可以按照前面的指示从<i>@apollo/client</i>库导入。考虑在GraphQL相关代码中使用前面推荐的结构。为了避免将来的缓存问题，在查询中使用_cache-and-network_ [fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy)。它可以像这样与<em>useQuery</em>钩子一起使用。

```javascript
useQuery(MY_QUERY, {
  fetchPolicy: 'cache-and-network',
  // Other options
});
```

<!-- The changes in the <em>useRepositories</em> hook should not affect the <em>RepositoryList</em> component in any way.-->
 <em>useRepositories</em>钩子的变化不应该以任何方式影响<em>RepositoryList</em>组件。

</div>

<div class="content">

### Environment variables

<!-- Every application will most likely run in more than one environment. Two obvious candidates for these environments are the development environment and the production environment. Out of these two, the development environment is the one we are running the application right now. Different environments usually have different dependencies, for example, the server we are developing locally might use a local database whereas the server that is deployed to the production environment uses the production database. To make the code environment independent we need to parametrize these dependencies. At the moment we are using one very environment dependant hardcoded value in our application: the URL of the server.-->
 每个应用都很可能在一个以上的环境中运行。这些环境的两个明显的候选者是开发环境和生产环境。在这两个环境中，开发环境是我们现在正在运行的应用。不同的环境通常有不同的依赖性，例如，我们在本地开发的服务器可能使用本地数据库，而部署到生产环境的服务器则使用生产数据库。为了使代码独立于环境，我们需要将这些依赖关系参数化。目前，我们在应用中使用一个非常依赖环境的硬编码值：服务器的URL。

<!-- We have previously learned that we can provide running programs with environment variables. These variables can be defined in the command line or using environment configuration files such as <i>.env</i> files and third-party libraries such as <i>Dotenv</i>. Unfortunately, React Native doesn't have direct support for environment variables. However, we can access the Expo configuration defined in the <i>app.json</i> file at runtime from our JavaScript code. This configuration can be used to define and access environment dependant variables.-->
 我们之前已经知道，我们可以为运行中的程序提供环境变量。这些变量可以在命令行中定义，或者使用环境配置文件，如<i>.env</i>文件和第三方库，如<i>Dotenv</i>。不幸的是，React Native没有对环境变量的直接支持。然而，我们可以在运行时从我们的JavaScript代码中访问<i>app.json</i>文件中定义的Expo配置。这个配置可以用来定义和访问与环境有关的变量。

<!-- The configuration can be accessed by importing the <em>Constants</em> constant from the <i>expo-constants</i> module as we have done a few times before. Once imported, the <em>Constants.manifest</em> property will contain the configuration. Let's try this by logging <em>Constants.manifest</em> in the <em>App</em> component:-->
配置可以通过从<i>expo-constants</i>模块导入<em>Constants</em>常量来访问，我们之前已经做过几次。一旦导入，<em>Constants.manifest</em>属性将包含配置。让我们通过在<em>App</em>组件中记录<em>Constants.manifest</em>来试试。

```javascript
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client';
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

<!-- You should now see the configuration in the logs.-->
 你现在应该在日志中看到配置了。

<!-- The next step is to use the configuration to define environment dependant variables in our application. Let's get started by renaming the <i>app.json</i> file to <i>app.config.js</i>. Once the file is renamed, we can use JavaScript inside the configuration file. Change the file contents so that the previous object:-->
 下一步是在我们的应用中使用配置来定义环境相关的变量。让我们先把<i>app.json</i>文件重命名为<i>app.config.js</i>。一旦文件被重命名，我们就可以在配置文件中使用JavaScript。改变文件内容，使之前的对象。

```javascript
{
  "expo": {
    "name": "rate-repository-app",
    // rest of the configuration...
  }
}
```

<!-- Is turned into an export, which contains the contents of the <em>expo</em> property:-->
 变成一个出口，其中包含<em>expo</em>属性的内容。

```javascript
export default {
   name: 'rate-repository-app',
   // rest of the configuration...
};
```

<!-- Expo has reserved an [extra](https://docs.expo.dev/guides/environment-variables/#using-app-manifest--extra) property in the configuration for any application-specific configuration. To see how this works, let's add an <em>env</em> variable into our application's configuration:-->
 Expo在配置中为任何特定应用的配置保留了一个[extra](https://docs.expo.dev/guides/environment-variables/#using-app-manifest--extra)属性。为了了解这一点，让我们在我们应用的配置中添加一个<em>env</em>变量。

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

<!-- Restart Expo development tools to apply the changes and you should see that the value of <em>Constants.manifest</em> property has changed and now includes the <em>extra</em> property containing our application-specific configuration. Now the value of the <em>env</em> variable is accessible through the <em>Constants.manifest.extra.env</em> property.-->
 重新启动Expo开发工具以应用这些变化，你应该看到<em>Constants.manifest</em>属性的值已经改变，现在包括了包含我们应用特定配置的<em>extra</em>属性。现在，<em>env</em>变量的值可以通过<em>Constants.manifest.extra.env</em>属性访问。

<!-- Because using hard coded configuration is a bit silly, let's use an environment variable instead:-->
 因为使用硬编码的配置有点傻，所以让我们使用环境变量来代替。

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

<!-- As we have learned, we can set the value of an environment variable through the command line by defining the variable's name and value before the actual command. As an example, start Expo development tools and set the environment variable <em>ENV</em> as <em>test</em> like this:-->
 正如我们所学到的，我们可以通过命令行来设置环境变量的值，方法是在实际命令前定义变量的名称和值。举个例子，启动Expo开发工具，将环境变量<em>ENV</em>设置为<em>test</em>，像这样。

```shell
ENV=test npm start
```

<!-- If you take a look at the logs, you should see that the <em>Constants.manifest.extra.env</em> property has changed.-->
 如果你看一下日志，你应该看到<em>Constants.manifest.extra.env</em>属性已经改变。

<!-- We can also load environment variables from an <em>.env</em> file as we have learned in the previous parts. First, we need to install the [Dotenv](https://www.npmjs.com/package/dotenv) library:-->
 我们也可以从<em>.env</em>文件中加载环境变量，正如我们在前面的部分所学到的。首先，我们需要安装[Dotenv](https://www.npmjs.com/package/dotenv)库。

```shell
npm install dotenv
```

<!-- Next, add a <em>.env</em> file in the root directory of our project with the following content:-->
 接下来，在我们项目的根目录下添加一个<em>.env</em>文件，内容如下。

```
ENV=development
```

<!-- Finally, import the library in the <i>app.config.js</i> file:-->
 最后，在<i>app.config.js</i>文件中导入该库。

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

<!-- You need to restart Expo development tools to apply the changes you have made to the <i>.env</i> file.-->
 你需要重新启动Expo开发工具来应用你对<i>.env</i>文件所做的修改。

<!-- Note that it is <i>never</i> a good idea to put sensitive data into the application's configuration. The reason for this is that once a user has downloaded your application, they can, at least in theory, reverse engineer your application and figure out the sensitive data you have stored into the code.-->
 注意，把敏感数据放到应用的配置中是一个好主意。原因是，一旦用户下载了你的应用，至少在理论上，他们可以对你的应用进行逆向工程，找出你存储在代码中的敏感数据。

</div>

<div class="tasks">

### Exercise 10.12.

#### Exercise 10.12: environment variables

<!-- Instead of the hardcoded Apollo Server's URL, use an environment variable defined in the <i>.env</i> file when initializing the Apollo Client. You can name the environment variable for example <em>APOLLO_URI</em>.-->
 在初始化Apollo客户端时，使用<i>.env</i>文件中定义的环境变量，而不是硬编码的Apollo服务器的URL。你可以给这个环境变量命名，例如<em>APOLLO_URI</em>。

<i>Do not</i> try to access environment variables like <em>process.env.APOLLO_URI</em> outside the <i>app.config.js</i> file. Instead use the <em>Constants.manifest.extra</em> object like in the previous example. In addition, do not import the dotenv library outside the <i>app.config.js</i> file or you will most likely face errors.

</div>

<div class="content">

### Storing data in the user's device

<!-- There are times when we need to store some persisted pieces of data in the user's device. One such common scenario is storing the user's authentication token so that we can retrieve it even if the user closes and reopens our application. In web development, we have used the browser's <em>localStorage</em> object to achieve such functionality. React Native provides similar persistent storage, the [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage/).-->
 有的时候我们需要在用户的设备中存储一些持久的数据片段。其中一个常见的场景是存储用户的认证令牌，这样即使用户关闭并重新打开我们的应用，我们也可以检索到它。在Web开发中，我们使用浏览器的<em>localStorage</em>对象来实现这种功能。React Native提供了类似的持久化存储，即[AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage/)。

<!-- We can use the <em>expo install</em> command to install the version of the <i>@react-native-async-storage/async-storage</i> package that is suitable for our Expo SDK version:-->
 我们可以使用<em>expo install</em>命令来安装适合我们Expo SDK版本的<i>@react-native-async-storage/async-storage</i>包。

```shell
expo install @react-native-async-storage/async-storage
```

<!-- The API of the <em>AsyncStorage</em> is in many ways same as the <em>localStorage</em> API. They are both key-value storages with similar methods. The biggest difference between the two is that, as the name implies, the operations of <em>AsyncStorage</em> are <i>asynchronous</i>.-->
 <em>AsyncStorage</em>的API在许多方面与<em>localStorage</em>的API相同。它们都是具有类似方法的键值存储。两者之间最大的区别是，正如其名称所暗示的，<em>AsyncStorage</em>的操作是<i>异步的</i>。

<!-- Because <em>AsyncStorage</em> operates with string keys in a global namespace it is a good idea to create a simple abstraction for its operations. This abstraction can be implemented for example using a [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). As an example, we could implement a shopping cart storage for storing the products user wants to buy:-->
 因为<em>AsyncStorage</em>在全局命名空间中对字符串键进行操作，所以为其操作创建一个简单的抽象是个好主意。这个抽象可以用一个[class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)来实现，例如。作为一个例子，我们可以实现一个购物车存储，用于存储用户想要购买的产品。

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

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

<!-- Because <em>AsyncStorage</em> keys are global, it is usually a good idea to add a <i>namespace</i> for the keys. In this context, the namespace is just a prefix we provide for the storage abstraction's keys. Using the namespace prevents the storage's keys from colliding with other <em>AsyncStorage</em> keys. In this example, the namespace is defined as the constructor's argument and we are using the <em>namespace:key</em> format for the keys.-->
 因为<em>AsyncStorage</em>键是全局的，所以通常为键添加一个<i>命名空间</i>是个好主意。在这种情况下，命名空间只是我们为存储抽象的键提供的一个前缀。使用命名空间可以防止存储的键与其他<em>AsyncStorage</em>键发生冲突。在这个例子中，命名空间被定义为构造函数的参数，我们使用<em>namespace:key</em>格式来表示键。

<!-- We can add an item to the storage using the [AsyncStorage.setItem](https://react-native-async-storage.github.io/async-storage/docs/api#setitem) method. The first argument of the method is the item's key and the second argument its value. The value <i>must be a string</i>, so we need to serialize non-string values as we did with the <em>JSON.stringify</em> method. The [AsyncStorage.getItem](https://react-native-async-storage.github.io/async-storage/docs/api/#getitem) method can be used to get an item from the storage. The argument of the method is the item's key, of which value will be resolved. The [AsyncStorage.removeItem](https://react-native-async-storage.github.io/async-storage/docs/api/#removeitem) method can be used to remove the item with the provided key from the storage.-->
 我们可以使用[AsyncStorage.setItem](https://react-native-async-storage.github.io/async-storage/docs/api#setitem)方法向存储添加一个项目。该方法的第一个参数是项目的键，第二个参数是其值。值<i>必须是一个字符串</i>，所以我们需要像使用<em>JSON.stringify</em>方法那样对非字符串值进行序列化。[AsyncStorage.getItem](https://react-native-async-storage.github.io/async-storage/docs/api/#getitem)方法可以用来从存储中获取一个项目。该方法的参数是项目的键，其值将被解析。[AsyncStorage.removeItem](https://react-native-async-storage.github.io/async-storage/docs/api/#removeitem)方法可以用来从存储中移除具有所提供的键的项目。

<!-- **NB:** [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) is similar persisted storage as the <em>AsyncStorage</em> but it encrypts the stored data. This makes it more suitable for storing more sensitive data such as the user's credit card number.-->
 **NB:** [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)是类似于<em>AsyncStorage</em>的持久化存储，但它对存储的数据进行加密。这使得它更适合于存储更敏感的数据，如用户的信用卡号码。

</div>

<div class="tasks">

### Exercises 10.13. - 10.14.

#### Exercise 10.13: the sign in form mutation

<!-- The current implementation of the sign in form doesn't do much with the submitted user's credentials. Let's do something about that in this exercise. First, read the rate-repository-api server's [authentication documentation](https://github.com/fullstack-hy2020/rate-repository-api#-authentication) and test the provided queries and mutations in the Apollo Sandbox. If the database doesn't have any users, you can populate the database with some seed data. Instructions for this can be found in the [getting started](https://github.com/fullstack-hy2020/rate-repository-api#-getting-started) section of the README.-->
 目前的签到表格的实现对提交的用户凭证没有什么作用。让我们在这个练习中做一些事情。首先，阅读rate-repository-api服务器的[认证文档](https://github.com/fullstack-hy2020/rate-repository-api#-authentication)并在Apollo沙盒中测试所提供的查询和改变。如果数据库没有任何用户，你可以用一些种子数据填充数据库。这方面的说明可以在README的[入门](https://github.com/fullstack-hy2020/rate-repository-api#-getting-started)部分找到。

<!-- Once you have figured out how the authentication works, create a file _useSignIn.js_ file in the <i>hooks</i> directory. In that file implement a <em>useSignIn</em> hook that sends the <em>authenticate</em> mutation using the [useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation) hook. Note that the <em>authenticate</em> mutation has a <i>single</i> argument called <em>credentials</em>, which is of type <em>AuthenticateInput</em>. This [input type](https://graphql.org/graphql-js/mutations-and-input-types) contains <em>username</em> and <em>password</em> fields.-->
 一旦你搞清楚了认证的工作方式，在<i>hooks</i>目录下创建一个_useSignIn.js_文件。在该文件中实现一个<em>useSignIn</em>钩子，使用[useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation)钩子发送<em>authenticate</em>改变。请注意，<em>authenticate</em>改变有一个<i>单一</i>参数，叫做<em>credentials</em>，它的类型是<em>AuthenticateInput</em>。这个[输入类型](https://graphql.org/graphql-js/mutations-and-input-types)包含<em>用户名</em>和<em>密码</em>字段。

<!-- The return value of the hook should be a tuple <em>[signIn, result]</em> where <em>result</em> is the mutations result as it is returned by the <em>useMutation</em> hook and <em>signIn</em> a function that runs the mutation with a <em>{ username, password }</em> object argument. Hint: don't pass the mutation function to the return value directly. Instead, return a function that calls the mutation function like this:-->
 钩子的返回值应该是一个元组<em>[signIn, result]</em>，其中<em>result</em>是改变的结果，因为它是由<em>useMutation</em>钩子返回的，<em>signIn</em>是运行改变的函数，有<em>{ username, password }</em>对象参数。提示：不要直接将改变函数传递给返回值。相反，返回一个调用改变函数的函数，像这样。

```javascript
const useSignIn = () => {
  const [mutate, result] = useMutation(/* mutation arguments */);

  const signIn = async ({ username, password }) => {
    // call the mutate function here with the right arguments
  };

  return [signIn, result];
};
```

<!-- Once the hook is implemented, use it in the <em>SignIn</em> component's <em>onSubmit</em> callback for example like this:-->
 一旦钩子实现，在<em>SignIn</em>组件的<em>onSubmit</em>回调中使用它，例如像这样。

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

<!-- This exercise is completed once you can log the user's <i>authenticate</i> mutations result after the sign in form has been submitted. The mutation result should contain the user's access token.-->
 一旦你能在签到表格提交后记录用户的<i>authenticate</i>改变结果，这个练习就完成了。改变的结果应该包含用户的访问令牌。

#### Exercise 10.14: storing the access token step1

<!-- Now that we can obtain the access token we need to store it. Create a file <i>authStorage.js</i> in the <i>utils</i> directory with the following content:-->
 现在我们可以获得访问令牌，我们需要存储它。在<i>utils</i>目录下创建一个文件<i>authStorage.js</i>，内容如下。

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

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

<!-- Next, implement the methods <em>AuthStorage.getAccessToken</em>, <em>AuthStorage.setAccessToken</em> and <em>AuthStorage.removeAccessToken</em>. Use the <em>namespace</em> variable to give your keys a namespace like we did in the previous example.-->
 接下来，实现方法<em>AuthStorage.getAccessToken</em>、<em>AuthStorage.setAccessToken</em>和<em>AuthStorage.removeAccessToken</em>。使用<em>namespace</em>变量给你的键一个命名空间，就像我们在前面的例子中做的那样。

</div>

<div class="content">

### Enhancing Apollo Client's requests

<!-- Now that we have implemented storage for storing the user's access token, it is time to start using it. Initialize the storage in the <em>App</em> component:-->
 现在我们已经实现了用于存储用户访问令牌的存储，是时候开始使用它了。在<em>App</em>组件中初始化存储。

```javascript
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client';

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

<!-- We also provided the storage instance for the <em>createApolloClient</em> function as an argument. This is because next, we will send the access token to Apollo Server in each request. The Apollo Server will expect that the access token is present in the <i>Authorization</i> header in the format <i>Bearer <ACCESS_TOKEN></i>. We can enhance the Apollo Client's request by using the [setContext](https://www.apollographql.com/docs/react/api/link/apollo-link-context/s) function. Let's send the access token to the Apollo Server by modifying the <em>createApolloClient</em> function in the <i>apolloClient.js</i> file:-->
 我们还为<em>createApolloClient</em>函数提供了存储实例作为一个参数。这是因为接下来，我们将在每个请求中向Apollo服务器发送访问令牌。Apollo服务器将期望访问令牌存在于<i>Authorization</i>头中，格式为<i>Bearer <ACCESS_TOKEN></i>。我们可以通过使用[setContext](https://www.apollographql.com/docs/react/api/link/apollo-link-context/s)函数增强Apollo客户端的请求。让我们通过修改<i>apolloClient.js</i>文件中的<em>createApolloClient</em>函数将访问令牌发送给Apollo服务器。

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Constants from 'expo-constants';
import { setContext } from '@apollo/client/link/context'; // highlight-line

// You might need to change this depending on how you have configured the Apollo Server's URI
const { apolloUri } = Constants.manifest.extra;

const httpLink = createHttpLink({
  uri: apolloUri,
});

// highlight-start
const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();

      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.log(e);

      return {
        headers,
      };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
// highlight-end

export default createApolloClient;
```

### Using React Context for dependency injection

<!-- The last piece of the sign-in puzzle is to integrate the storage to the <em>useSignIn</em> hook. To achieve this the hook must be able to access token storage instance we have initialized in the <em>App</em> component. React [Context](https://reactjs.org/docs/context.html) is just the tool we need for the job. Create a directory <i>contexts</i> in the <i>src</i> directory. In that directory create a file <i>AuthStorageContext.js</i> with the following content:-->
 签到拼图的最后一块是将存储整合到<em>useSignIn</em>挂钩。为了实现这一点，挂钩必须能够访问我们在<em>App</em>组件中初始化的token存储实例。React [Context](https://reactjs.org/docs/context.html)正是我们需要的工作工具。在<i>src</i>目录下创建一个目录<i>contexts</i>。在该目录中创建一个文件<i>AuthStorageContext.js</i>，内容如下。

```javascript
import React from 'react';

const AuthStorageContext = React.createContext();

export default AuthStorageContext;
```

<!-- Now we can use the <em>AuthStorageContext.Provider</em> to provide the storage instance to the descendants of the context. Let's add it to the <em>App</em> component:-->
 现在我们可以使用<em>AuthStorageContext.Provider</em>来为上下文的后代提供存储实例。让我们把它添加到<em>App</em>组件中。

```javascript
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client';

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

<!-- Accessing the storage instance in the <em>useSignIn</em> hook is now possible using the React's [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) hook like this:-->
 在<em>useSignIn</em>钩中访问存储实例，现在可以使用React's [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)钩，像这样。

```javascript
// ...
import { useContext } from 'react'; // highlight-line

import AuthStorageContext from '../contexts/AuthStorageContext'; //highlight-line

const useSignIn = () => {
  const authStorage = useContext(AuthStorageContext); //highlight-line
  // ...
};
```

<!-- Note that accessing a context's value using the <em>useContext</em> hook only works if the <em>useContext</em> hook is used in a component that is a <i>descendant</i> of the [Context.Provider](https://reactjs.org/docs/context.html#contextprovider) component.-->
 注意，使用<em>useContext</em>钩子访问一个上下文的值，只有当<em>useContext</em>钩子被用于一个[Context.Provider](https://reactjs.org/docs/context.html#contextprovider)组件的<i>后裔</i>的组件时，才会生效。

<!-- Accessing the <em>AuthStorage</em> instance with <em>useContext(AuthStorageContext)</em> is quite verbose and reveals the details of the implementation. Let's improve this by implementing a <em>useAuthStorage</em> hook in a <i>useAuthStorage.js</i> file in the <i>hooks</i> directory:-->
 用<em>useContext(AuthStorageContext)</em>访问<em>AuthStorage</em>实例是相当啰嗦的，而且会暴露实现的细节。让我们通过在<i>hooks</i>目录下的<i>useAuthStorage.js</i>文件中实现一个<em>useAuthStorage</em>钩子来改进。

```javascript
import { useContext } from 'react';

import AuthStorageContext from '../contexts/AuthStorageContext';

const useAuthStorage = () => {
  return useContext(AuthStorageContext);
};

export default useAuthStorage;
```

<!-- The hook's implementation is quite simple but it improves the readability and maintainability of the hooks and components using it. We can use the hook to refactor the <em>useSignIn</em> hook like this:-->
 该钩子的实现相当简单，但它提高了使用它的钩子和组件的可读性和可维护性。我们可以用这个钩子来重构<em>useSignIn</em>钩子，像这样。

```javascript
// ...
import useAuthStorage from '../hooks/useAuthStorage'; // highlight-line

const useSignIn = () => {
  const authStorage = useAuthStorage(); //highlight-line
  // ...
};
```

<!-- The ability to provide data to component's descendants opens tons of use cases for React Context. To learn more about these use cases, read Kent C. Dodds' enlightening article [How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively) to find out how to combine the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook with the context to implement state management. You might find a way to use this knowledge in the upcoming exercises.-->
 为组件的后代提供数据的能力为React Context打开了大量的用例。要了解更多关于这些用例的信息，请阅读Kent C. Dodds的启发性文章[How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)，了解如何将[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)钩子与上下文结合起来，实现状态管理。你可能会在接下来的练习中找到使用这些知识的方法。

</div>

<div class="tasks">

### Exercises 10.15. - 10.16.

#### Exercise 10.15: storing the access token step2

<!-- Improve the <em>useSignIn</em> hook so that it stores the user's access token retrieved from the <i>authenticate</i> mutation. The return value of the hook should not change. The only change you should make to the <em>SignIn</em> component is that you should redirect the user to the reviewed repositories list view after a successful sign in. You can achieve this by using the [useNavigate](https://reactrouter.com/docs/en/v6/api#usenavigate) hook.-->
 改进<em>useSignIn</em>钩子，使其存储从<i>authenticate</i>改变中获取的用户访问令牌。该钩子的返回值不应该改变。你应该对<em>SignIn</em>组件做出的唯一改变是，你应该在成功登录后将用户重定向到已审核的存储库列表视图。你可以通过使用[useNavigate](https://reactrouter.com/docs/en/v6/api#usenavigate)钩子来实现这一点。

<!-- After the <i>authenticate</i> mutation has been executed and you have stored the user's access token to the storage, you should reset the Apollo Client's store. This will clear the Apollo Client's cache and re-execute all active queries. You can do this by using the Apollo Client's [resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore) method. You can access the Apollo Client in the <em>useSignIn</em> hook using the [useApolloClient](https://www.apollographql.com/docs/react/api/react/hooks/#useapolloclient) hook. Note that the order of the execution is crucial and should be the following:-->
 在<i>authenticate</i>改变被执行后，你已经将用户的访问令牌存储到存储区，你应该重置Apollo客户端的存储。这将清除Apollo客户端的缓存并重新执行所有活动的查询。你可以通过使用Apollo客户端的[resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore)方法来做到这一点。你可以使用[useApolloClient](https://www.apollographql.com/docs/react/api/react/hooks/#useapolloclient)钩子访问<em>useSignIn</em>钩子中的Apollo客户端。注意，执行的顺序很关键，应该是这样的。

```javascript
const { data } = await mutate(/* options */);
await authStorage.setAccessToken(/* access token from the data */);
apolloClient.resetStore();
```

#### Exercise 10.16: sign out

<!-- The final step in completing the sign in feature is to implement a sign out feature. The <em>me</em> query can be used to check the authenticated user's information. If the query's result is <em>null</em>, that means that the user is not authenticated. Open the Apollo Sandbox and run the following query:-->
 完成签入功能的最后一步是实现签出功能。<em>me</em>查询可以用来检查已认证用户的信息。如果查询的结果是<em>null</em>，这意味着用户没有被认证。打开Apollo沙盒，运行以下查询。

```javascript
{
  me {
    id
    username
  }
}
```

<!-- You will probably end up with the <em>null</em> result. This is because the Apollo Sandbox is not authenticated, meaning that it doesn't send a valid access token with the request. Revise the [authentication documentation](https://github.com/fullstack-hy2020/rate-repository-api#-authentication) and retrieve an access token using the <em>authenticate</em> mutation. Use this access token in the _Authorization_ header as instructed in the documentation. Now, run the <em>me</em> query again and you should be able to see the authenticated user's information.-->
 你可能最终会得到<em>null</em>的结果。这是因为Apollo沙盒没有被认证，意味着它没有随请求发送一个有效的访问令牌。修改[认证文档](https://github.com/fullstack-hy2020/rate-repository-api#-authentication)并使用<em>authenticate</em>改变检索一个访问令牌。按照文档中的指示，在_Authorization_标头中使用这个访问令牌。现在，再次运行<em>me</em>查询，你应该能够看到已认证用户的信息。

<!-- Open the <em>AppBar</em> component in the <i>AppBar.jsx</i> file where you currently have the tabs "Repositories" and "Sign in". Change the tabs so that if the user is signed in the tab "Sign out" is displayed, otherwise show the "Sign in" tab. You can achieve this by using the <em>me</em> query with the [useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery) hook.-->
 打开<i>AppBar.jsx</i>文件中的<em>AppBar</em>组件，目前有 "Repositories "和 "Sign in "标签。改变这些标签，如果用户已经登录，就显示 "退出 "标签，否则就显示 "登录 "标签。你可以通过使用带有[useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery)钩子的<em>me</em>查询来实现这一点。

<!-- Pressing the "Sign out" tab should remove the user's access token from the storage and reset the Apollo Client's store with the [resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore) method. Calling the <em>resetStore</em> method should automatically re-execute all active queries which means that the <em>me</em> query should be re-executed. Note that the order of execution is crucial: access token must be removed from the storage <i>before</i> the Apollo Client's store is reset.-->
 按下 "签出 "标签应该从存储中删除用户的访问令牌，并用[resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore)方法重置Apollo客户端的存储。调用<em>resetStore</em>方法应该自动重新执行所有活动的查询，这意味着<em>me</em>查询应该被重新执行。请注意，执行的顺序是至关重要的：访问令牌必须在<i></i>Apollo客户端的存储被重置之前从存储中移除。

<!-- This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Note that exercises in this section should be submitted to the part 3 in the exercise submission system.-->
 这是本节的最后一个练习。现在是时候把你的代码推送到GitHub，并把你所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020)。注意，本节的练习应该提交到练习提交系统中的第3章节。
</div>
