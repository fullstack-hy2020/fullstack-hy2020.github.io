---
mainImage: ../../../images/part-10.svg
part: 10
letter: d
lang: zh
---

<div class="content">

<!-- Now that we have established a good foundation for our project, it is time to start expanding it. In this section you can put to use all the React Native knowledge you have gained so far. Along with expanding our application we will cover some new areas, such as testing, and additional resources.-->
现在我们已经为我们的项目奠定了良好的基础，是时候开始扩展它了。在这一节中，你可以运用你所获得的React Native知识。除了扩展我们的应用程序，我们还将涵盖一些新领域，如测试和其他资源。

### Testing React Native applications

<!-- To start testing code of any kind, the first thing we need is a testing framework, which we can use to run a set of test cases and inspect their results. For testing a JavaScript application, [Jest](https://jestjs.io/) is a popular candidate for such testing framework. For testing an Expo based React Native application with Jest, Expo provides a set of Jest configuration in a form of [jest-expo](https://github.com/expo/expo/tree/master/packages/jest-expo) preset. In order to use ESLint in the Jest's test files, we also need the [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) plugin for ESLint. Let's get started by installing the packages:-->
要开始测试任何类型的代码，我们首先需要的是一个测试框架，我们可以使用它来运行一组测试用例并检查它们的结果。 对于测试JavaScript应用程序，[Jest](https://jestjs.io/)是一个流行的候选测试框架。 对于使用Jest测试基于Expo的React Native应用程序，Expo提供了一组以[jest-expo](https://github.com/expo/expo/tree/master/packages/jest-expo)预设形式提供的Jest配置。 为了在Jest的测试文件中使用ESLint，我们还需要ESLint的[eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)插件。 让我们开始通过安装这些软件包来开始：

```shell
npm install --save-dev jest jest-expo eslint-plugin-jest
```

<!-- To use the jest-expo preset in Jest, we need to add the following Jest configuration to the <i>package.json</i> file along with the <i>test</i> script:-->
我们需要将以下Jest配置添加到<i>package.json</i>文件以及<i>test</i>脚本中，以使用Jest-Expo预设：

```
"jest": {
  "preset": "jest-expo"
}
```

```javascript
{
  // ...
  "scripts": {
    // other scripts...
    "test": "jest" // highlight-line
  },
  // highlight-start
  "jest": {
    "preset": "jest-expo",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-router-native)"
    ]
  },
  // highlight-end
  // ...
}
```

<!-- The <em>transform</em> option tells Jest to transform <i>.js</i> and <i>.jsx</i> files with the [Babel](https://babeljs.io/) compiler. The <em>transformIgnorePatterns</em> option is for ignoring certain directories in the <i>node_modules</i> directory while transforming files. This Jest configuration is almost identical to the one proposed in the Expo''s [documentation](https://docs.expo.io/guides/testing-with-jest/).-->
<em>transform</em> 选项告诉 Jest 使用 [Babel](https://babeljs.io/) 编译器来转换 <i>.js</i> 和 <i>.jsx</i> 文件。<em>transformIgnorePatterns</em> 选项用于在转换文件时忽略 <i>node_modules</i> 目录中的某些目录。这个 Jest 配置几乎与 Expo 的[文档](https://docs.expo.io/guides/testing-with-jest/)中提出的配置相同。

<!-- To use the eslint-plugin-jest plugin in ESLint, we need to include it in the plugins and extensions array in the <i>.eslintrc</i> file:-->
要在 ESLint 中使用 eslint-plugin-jest 插件，我们需要在 <i>.eslintrc</i> 文件中的 plugins 和 extensions 数组中包含它：

```javascript
{
  "plugins": ["react", "react-native"],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:jest/recommended"], // highlight-line
  "parser": "@babel/eslint-parser",
  "env": {
    "react-native/react-native": true
  },
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

<!-- To see that the setup is working, create a directory <i>\_\_tests\_\_</i> in the <i>src</i> directory and in the created directory create a file <i>example.test.js</i>. In that file, add this simple test:-->
在<i>src</i> 目录中创建一个目录 <i>\_\_tests\_\_</i>，以确认设置正常工作，并在该目录中创建文件 <i>example.test.js</i>。在该文件中添加以下简单测试：

```javascript
describe('Example', () => {
  it('works', () => {
    expect(1).toBe(1);
  });
});
```

<!-- Now, let's run our example test by running <em>npm test</em>. The command's output should indicate that the test located in the <i>src/\_\_tests\_\_/example.test.js</i> file is passed.-->
现在，让我们通过运行<em>npm test</em>来运行我们的示例测试。该命令的输出应该表明位于<i>src/\_\_tests\_\_/example.test.js</i>文件中的测试已通过。

### Organizing tests

<!-- Organizing test files in a single <i>\_\_tests\_\_</i> directory is one approach in organizing the tests. When choosing this approach, it is recommended to put the test files in their corresponding subdirectories just like the code itself. This means that for example tests related to components are in the <i>components</i> directory, tests related to utilities are in the <i>utils</i> directory, and so on. This will result in the following structure:-->
将测试文件组织在单个<i>\_\_tests\_\_</i>目录中是组织测试的一种方法。 选择此方法时，建议将测试文件放在其相应的子目录中，就像代码本身一样。 例如，与组件相关的测试位于<i>components</i>目录中，与实用程序相关的测试位于<i>utils</i>目录中，等等。 这将导致以下结构：

```bash
src/
  __tests__/
    components/
      AppBar.js
      RepositoryList.js
      ...
    utils/
      authStorage.js
      ...
    ...
```

<!-- Another approach is to organize the tests near the implementation. This means that for example, the test file containing tests for the <em>AppBar</em> component is in the same directory as the component''s code. This will result in the following structure:-->
另一种方法是在实现附近组织测试。这意味着例如，包含<em>AppBar</em>组件测试的测试文件位于与组件代码相同的目录中。这将导致以下结构：

```bash
src/
  components/
    AppBar/
      AppBar.test.jsx
      index.jsx
    ...
  ...
```

<!-- In this example, the component''s code is in the <i>index.jsx</i> file and the test in the <i>AppBar.test.jsx</i> file. Note that in order to Jest finding your test files you either have to put them into a <i>\_\_tests\_\_</i> directory, use the <i>.test</i> or <i>.spec</i> suffix, or [manually configure](https://jestjs.io/docs/en/configuration#testmatch-arraystring) the global patterns.-->
在这个例子中，组件的代码在<i>index.jsx</i>文件中，而测试在<i>AppBar.test.jsx</i>文件中。注意，为了让Jest找到你的测试文件，你要么把它们放到<i>\_\_tests\_\_</i>目录中，要么使用<i>.test</i>或<i>.spec</i>后缀，要么[手动配置](https://jestjs.io/docs/en/configuration#testmatch-arraystring)全局模式。

### Testing components

<!-- Now that we have managed to set up Jest and run a very simple test, it is time to find out how to test components. As we know, testing components requires a way to serialize a component''s render output and simulate firing different kind of events, such as pressing a button. For these purposes, there is the [Testing Library](https://testing-library.com/docs/intro) family, which provides libraries for testing user interface components in different platforms. All of these libraries share similar API for testing user interface components in a user-centric way.-->
现在我们已经成功地设置了Jest并运行了一个非常简单的测试，是时候弄清楚如何测试组件了。正如我们所知，测试组件需要一种方法来序列化组件的渲染输出，并模拟触发不同类型的事件，比如按下按钮。为此，有[Testing Library](https://testing-library.com/docs/intro)家族，它提供了用于在不同平台上测试用户界面组件的库。所有这些库都共享相似的API，以以用户为中心的方式测试用户界面组件。

<!-- In [part 5](/en/part5/testing_react_apps) we got familiar with one of these libraries, the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro). Unfortunately, this library is only suitable for testing React web applications. Luckily, there exists a React Native counterpart for this library, which is the [React Native Testing Library](https://callstack.github.io/react-native-testing-library/). This is the library we will be using while testing our React Native application's components. The good news is, that these libraries share a very similar API, so there aren't too many new concepts to learn. In addition to the React Native Testing Library, we need a set of React Native specific Jest matchers such as <em>toHaveTextContent</em> and <em>toHaveProp</em>. These matchers are provided by the [jest-native](https://github.com/testing-library/jest-native) library. Before getting into the details, let''s install these packages:-->
在[第五部分](/en/part5/testing_react_apps)中，我们熟悉了其中一个库[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)。不幸的是，这个库只适用于测试React网络应用程序。幸运的是，这个库有一个React Native对应库，即[React Native Testing Library](https://callstack.github.io/react-native-testing-library/)。这就是我们在测试React Native应用程序组件时要使用的库。好消息是，这些库具有非常相似的API，所以没有太多新的概念要学习。除了React Native Testing Library之外，我们还需要一组React Native特定的Jest匹配器，如<em>toHaveTextContent</em>和<em>toHaveProp</em>。这些匹配器由[jest-native](https://github.com/testing-library/jest-native)库提供。在深入细节之前，让我们安装这些软件包：

```shell
npm install --save-dev --legacy-peer-deps react-test-renderer@18.2.0 @testing-library/react-native @testing-library/jest-native
```

<!-- **NB:** If you face peer dependency issues, make sure that the react-test-renderer version matches the project''s React version in the <em>npm install</em> command above. You can check the React version by running <em>npm list react --depth=0</em>.-->
**中文：**如果遇到对等依赖关系问题，请确保在上面的<em>npm install</em>命令中，react-test-renderer版本与项目的React版本匹配。您可以通过运行<em>npm list react --depth=0</em>来检查React版本。

<!-- If the installation fails due to peer dependency issues, try again using the <em>--legacy-peer-deps</em> flag with the <em>npm install</em> command.-->
如果安装由于对等依赖关系问题失败，请使用<em>--legacy-peer-deps</em>标志再次尝试<em>npm install</em>命令。

<!-- To be able to use these matchers we need to extend the Jest''s <em>expect</em> object. This can be done by using a global setup file. Create a file <i>setupTests.js</i> in the root directory of your project, that is, the same directory where the <i>package.json</i> file is located. In that file add the following line:-->
要使用这些匹配器，我们需要扩展 Jest 的<em>expect</em> 对象。这可以通过使用全局设置文件来完成。在项目的根目录下创建一个文件 <i>setupTests.js</i>，也就是与 <i>package.json</i> 文件位于同一目录下的文件。在该文件中添加以下行：

```javascript
import '@testing-library/jest-native/extend-expect';
```

<!-- Next, configure this file as a setup file in the Jest''s configuration in the <i>package.json</i> file (note that the <em>\<rootDir></em> in the path is intentional and there is no need to replace it):-->
下一步，在<i>package.json</i>文件中的Jest配置中配置此文件作为设置文件（注意路径中的<em>\<rootDir></em>是有意的，无需替换）：

```javascript
{
  // ...
  "jest": {
    "preset": "jest-expo",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|react-router-native)"
    ],
    "setupFilesAfterEnv": ["<rootDir>/setupTests.js"] // highlight-line
  }
  // ...
}
```

<!-- The main concepts of the React Native Testing Library are the [queries](https://callstack.github.io/react-native-testing-library/docs/api-queries) and [firing events](https://callstack.github.io/react-native-testing-library/docs/api#fireevent). Queries are used to extract a set of nodes from the component that is rendered using the [render](https://callstack.github.io/react-native-testing-library/docs/api#render) function. Queries are useful in tests where we expect for example some text, such as the name of a repository, to be present in the rendered component. Here's an example how to use the [ByText](https://callstack.github.io/react-native-testing-library/docs/api-queries/#bytext) query to check if the component's <em>Text</em> element has the correct textual content:-->
React Native Testing Library 的主要概念是[查询](https://callstack.github.io/react-native-testing-library/docs/api-queries)和[触发事件](https://callstack.github.io/react-native-testing-library/docs/api#fireevent)。查询用于使用[render](https://callstack.github.io/react-native-testing-library/docs/api#render)函数从呈现的组件中提取一组节点。在我们期望例如仓库名称等文本出现在呈现的组件中的测试中，查询非常有用。以下是使用[ByText](https://callstack.github.io/react-native-testing-library/docs/api-queries/#bytext)查询检查组件的<em>Text</em>元素是否具有正确的文本内容的示例：

```javascript
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

const Greeting = ({ name }) => {
  return (
    <View>
      <Text>Hello {name}!</Text>
    </View>
  );
};

describe('Greeting', () => {
  it('renders a greeting message based on the name prop', () => {
    render(<Greeting name="Kalle" />);

    screen.debug();

    expect(screen.getByText('Hello Kalle!')).toBeDefined();
  });
});
```

<!-- Tests use the object [screen](https://callstack.github.io/react-native-testing-library/docs/api#screen) to do the queries to the rendered component.-->
测试使用[screen](https://callstack.github.io/react-native-testing-library/docs/api#screen)对渲染组件进行查询。

<!-- We acquire the <em>Text</em> node containing certain text by using the <em>getByText</em> function. The Jest matcher [toBeDefined](https://jestjs.io/docs/expect#tobedefined) is used to to ensure that the query has found the element.-->
我们通过使用<em>getByText</em>函数来获取包含某些文本的<em>Text</em>节点。Jest matcher [toBeDefined](https://jestjs.io/docs/expect#tobedefined)用于确保查询已找到元素。

<!-- React Native Testing Library''s documentation has some good hints on [how to query different kinds of elements](https://callstack.github.io/react-native-testing-library/docs/how-should-i-query). Another guide worth reading is Kent C. Dodds article [Making your UI tests resilient to change](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change).-->
React Native Testing Library 的文档有一些很好的提示[如何查询不同类型的元素](https://callstack.github.io/react-native-testing-library/docs/how-should-i-query)。另一篇值得阅读的指南是Kent C. Dodds的文章[使你的UI测试对更改具有弹性](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change)。

<!-- The object [screen](https://callstack.github.io/react-native-testing-library/docs/api#screen) has also a helper method [debug](https://callstack.github.io/react-native-testing-library/docs/api#debug) that prints the rendered React tree in a user-friendly format. Use it if you are unsure what the React tree rendered by the <em>render</em> function looks like.-->
对象[screen](https://callstack.github.io/react-native-testing-library/docs/api#screen)也有一个辅助方法[debug](https://callstack.github.io/react-native-testing-library/docs/api#debug)，它以用户友好的格式打印由<em>render</em>函数渲染的React树。如果不确定render函数渲染的React树是什么样子，可以使用它。

<!-- For all available queries, check the React Native Testing Library's [documentation](https://callstack.github.io/react-native-testing-library/docs/api-queries). The full list of available React Native specific matchers can be found in the [documentation](https://github.com/testing-library/jest-native#matchers) of the jest-native library. Jest's [documentation](https://jestjs.io/docs/en/expect) contains every universal Jest matcher.-->
对于所有可用的查询，请查看React Native Testing Library的[文档](https://callstack.github.io/react-native-testing-library/docs/api-queries)。可在jest-native库的[文档](https://github.com/testing-library/jest-native#matchers)中找到可用的React Native特定匹配器的完整列表。Jest的[文档](https://jestjs.io/docs/en/expect)包含每个通用Jest匹配器。

<!-- The second very important React Native Testing Library concept is firing events. We can fire an event in a provided node by using the [fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) object''s methods. This is useful for example typing text into a text field or pressing a button. Here is an example of how to test submitting a simple form:-->
第二个非常重要的React Native测试库概念是触发事件。我们可以使用[fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent)对象的方法在提供的节点中触发事件。这对于例如在文本字段中输入文本或按下按钮很有用。以下是如何测试提交简单表单的示例：

```javascript
import { useState } from 'react';
import { Text, TextInput, Pressable, View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';

const Form = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit({ username, password });
  };

  return (
    <View>
      <View>
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Username"
        />
      </View>
      <View>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
        />
      </View>
      <View>
        <Pressable onPress={handleSubmit}>
          <Text>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
};

describe('Form', () => {
  it('calls function provided by onSubmit prop after pressing the submit button', () => {
    const onSubmit = jest.fn();
    render(<Form onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
    fireEvent.press(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    // onSubmit.mock.calls[0][0] contains the first argument of the first call
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: 'kalle',
      password: 'password',
    });
  });
});
```

<!-- In this test, we want to test that after filling the form's fields using the <em>fireEvent.changeText</em> method and pressing the submit button using the <em>fireEvent.press</em> method, the <em>onSubmit</em> callback function is called correctly. To inspect whether the <em>onSubmit</em> function is called and with which arguments, we can use a [mock function](https://jestjs.io/docs/en/mock-function-api). Mock functions are functions with preprogrammed behavior such as a specific return value. In addition, we can create expectations for the mock functions such as "expect the mock function to have been called once". The full list of available expectations can be found in the Jest's [expect documentation](https://jestjs.io/docs/en/expect).-->
在这个测试中，我们想要测试在使用<em>fireEvent.changeText</em>方法填充表单字段，并使用<em>fireEvent.press</em>方法按下提交按钮后，<em>onSubmit</em>回调函数是否正确调用。为了检查<em>onSubmit</em>函数是否被调用以及使用哪些参数，我们可以使用[模拟函数](https://jestjs.io/docs/en/mock-function-api)。模拟函数是具有预先编程行为的函数，例如特定的返回值。此外，我们可以为模拟函数创建期望，例如“期望模拟函数被调用一次”。可用期望的完整列表可在Jest的[期望文档](https://jestjs.io/docs/en/expect)中找到。

<!-- Before heading further into the world of testing React Native applications, play around with these examples by adding a test file in the <i>\_\_tests\_\_</i> directory we created earlier.-->
在进一步深入测试React Native应用程序的世界之前，请在我们刚刚创建的<i>\_\_tests\_\_</i>目录中添加一个测试文件，玩玩这些示例。

### Handling dependencies in tests

<!-- Components in the previous examples are quite easy to test because they are more or less <i>pure</i>. Pure components don't depend on <i>side effects</i> such as network requests or using some native API such as the AsyncStorage. The <em>Form</em> component is much less pure than the <em>Greeting</em> component because its state changes can be counted as a side effect. Nevertheless, testing it isn't too difficult.-->
前面例子中的组件很容易测试，因为它们或多或少是<i>纯的</i>。 纯组件不依赖<i>副作用</i>，例如网络请求或使用某些本地API，例如AsyncStorage。 <em>表单</em>组件比<em>问候</em>组件更不纯，因为它的状态更改可以被认为是一种副作用。 但是，测试它也不是太困难。

<!-- Next, let's have a look at a strategy for testing components with side effects. Let's pick the <em>RepositoryList</em> component from our application as an example. At the moment the component has one side effect, which is a GraphQL query for fetching the reviewed repositories. The current implementation of the <em>RepositoryList</em> component looks something like this:-->
接下来，让我们来看一下测试具有副作用的组件的策略。让我们从我们的应用程序中选择<em>RepositoryList </em>组件作为示例。目前，该组件具有一个副作用，即用于获取审查存储库的GraphQL查询。 <em>RepositoryList </em>组件的当前实现看起来像这样：

```javascript
const RepositoryList = () => {
  const { repositories } = useRepositories();

  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
    />
  );
};

export default RepositoryList;
```

<!-- The only side effect is the use of the <em>useRepositories</em> hook, which sends a GraphQL query. There are a few ways to test this component. One way is to mock the Apollo Client's responses as instructed in the Apollo Client's [documentation](https://www.apollographql.com/docs/react/development-testing/testing/). A more simple way is to assume that the <em>useRepositories</em> hook works as intended (preferably through testing it) and extract the components "pure" code into another component, such as the <em>RepositoryListContainer</em> component:-->
只有一个副作用就是使用<em>useRepositories</em>钩子，它发送一个GraphQL查询。有几种方法可以测试这个组件。一种方法是模拟Apollo客户端的响应，如Apollo客户端[文档](https://www.apollographql.com/docs/react/development-testing/testing/)中所述。更简单的方法是假设<em>useRepositories</em>钩子按预期工作（最好是通过对其进行测试），并将组件的“纯”代码提取到另一个组件中，例如<em>RepositoryListContainer</em>组件：

```javascript
export const RepositoryListContainer = ({ repositories }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
    />
  );
};

const RepositoryList = () => {
  const { repositories } = useRepositories();

  return <RepositoryListContainer repositories={repositories} />;
};

export default RepositoryList;
```

<!-- Now, the <em>RepositoryList</em> component contains only the side effects and its implementation is quite simple. We can test the <em>RepositoryListContainer</em> component by providing it with paginated repository data through the <em>repositories</em> prop and checking that the rendered content has the correct information.-->
现在，<em>RepositoryList</em> 组件只包含副作用，其实现也相当简单。我们可以通过将分页仓库数据通过 <em>repositories</em> prop 提供给 <em>RepositoryListContainer</em> 组件来测试它，并检查渲染的内容是否具有正确的信息。

</div>

<div class="tasks">

### Exercises 10.17. - 10.18

#### Exercise 10.17: testing the reviewed repositories list

<!-- Implement a test that ensures that the <em>RepositoryListContainer</em> component renders repository's name, description, language, forks count, stargazers count, rating average, and review count correctly. One approach in implementing this test is to add a [testID](https://reactnative.dev/docs/view#testid) prop for the element wrapping a single repository's information:-->
实施一项测试，以确保<em>RepositoryListContainer</em> 组件正确渲染存储库的名称，描述，语言，分叉计数，星形计数，评分平均值和评论数。实施此测试的一种方法是为包装单个存储库信息的元素添加[testID](https://reactnative.dev/docs/view#testid) prop：

```javascript
const RepositoryItem = (/* ... */) => {
  // ...

  return (
    <View testID="repositoryItem" {/* ... */}>
      {/* ... */}
    </View>
  )
};
```

<!-- Once the <em>testID</em> prop is added, you can use the [getAllByTestId](https://callstack.github.io/react-native-testing-library/docs/api-queries#getallby) query to get those elements:-->
一旦添加了<em>testID</em>属性，您可以使用[getAllByTestId](https://callstack.github.io/react-native-testing-library/docs/api-queries#getallby)查询来获取这些元素：

```javascript
const repositoryItems = screen.getAllByTestId('repositoryItem');
const [firstRepositoryItem, secondRepositoryItem] = repositoryItems;

// expect something from the first and the second repository item
```

<!-- Having those elements you can use the [toHaveTextContent](https://github.com/testing-library/jest-native#tohavetextcontent) matcher to check whether an element has certain textual content. You might also find the [Querying Within Elements](https://testing-library.com/docs/dom-testing-library/api-within/) guide useful. If you are unsure what is being rendered, use the [debug](https://callstack.github.io/react-native-testing-library/docs/api#debug) function to see the serialized rendering result.-->
拥有这些元素，您可以使用[toHaveTextContent](https://github.com/testing-library/jest-native#tohavetextcontent)匹配器来检查元素是否具有某些文本内容。您可能还会发现[元素内查询](https://testing-library.com/docs/dom-testing-library/api-within/)指南有用。如果不确定正在渲染什么，请使用[debug](https://callstack.github.io/react-native-testing-library/docs/api#debug)函数查看序列化渲染结果。

<!-- Use this as a base for your test:-->
# 使用这个作为你的测试基础

```javascript
describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

      // Add your test code here
    });
  });
});
```

<!-- You can put the test file where you please. However, it is recommended to follow one of the ways of organizing test files introduced earlier. Use the <em>repositories</em> variable as the repository data for the test. There should be no need to alter the variable's value. Note that the repository data contains two repositories, which means that you need to check that both repositories' information is present.-->
你可以把测试文件放在你想放的地方。但是，建议遵循前面介绍的组织测试文件的方式之一。使用<em>存储库</em>变量作为测试的存储库数据。不应该改变变量的值。请注意，存储库数据包含两个存储库，这意味着你需要检查两个存储库的信息是否都存在。

#### Exercise 10.18: testing the sign in form

<!-- Implement a test that ensures that filling the sign in form's username and password fields and pressing the submit button <i>will call</i> the <em>onSubmit</em> handler with <i>correct arguments</i>. The <i>first argument</i> of the handler should be an object representing the form's values. You can ignore the other arguments of the function. Remember that the [fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) methods can be used for triggering events and a [mock function](https://jestjs.io/docs/en/mock-function-api) for checking whether the <em>onSubmit</em> handler is called or not.-->
实现一个测试，确保填写登录表单的用户名和密码字段并按下提交按钮<i>会调用</i> <em>onSubmit</em> 处理程序，并传入<i>正确的参数</i>。处理程序的<i>第一个参数</i>应该是一个表示表单值的对象。您可以忽略函数的其他参数。请记住，可以使用[fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent)方法触发事件，并使用[mock function](https://jestjs.io/docs/en/mock-function-api)来检查是否调用了<em>onSubmit</em>处理程序。

<!-- You don''t have to test any Apollo Client or AsyncStorage related code which is in the <em>useSignIn</em> hook. As in the previous exercise, extract the pure code into its own component and test it in the test.-->
你不必测试在<em>useSignIn</em>钩子中的任何Apollo Client或AsyncStorage相关的代码。正如在上一个练习中，将纯代码提取到自己的组件中，并在测试中进行测试。

<!-- Note that Formik's form submissions are <i>asynchronous</i> so expecting the <em>onSubmit</em> function to be called immediately after pressing the submit button won't work. You can get around this issue by making the test function an async function using the <em>async</em> keyword and using the React Native Testing Library's [waitFor](https://callstack.github.io/react-native-testing-library/docs/api#waitfor) helper function. The <em>waitFor</em> function can be used to wait for expectations to pass. If the expectations don't pass within a certain period, the function will throw an error. Here is a rough example of how to use it:-->
注意，Formik 的表单提交是<i>异步</i>的，因此不能指望在按下提交按钮后立即调用<em>onSubmit</em>函数。您可以通过使用<em>async</em>关键字将测试函数改为异步函数，并使用React Native Testing Library 的[waitFor](https://callstack.github.io/react-native-testing-library/docs/api#waitfor)辅助函数来解决此问题。<em>waitFor</em>函数可用于等待期望通过。如果期望在一定时间内不通过，该函数将抛出错误。以下是如何使用它的粗略示例：

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
// ...

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      // render the SignInContainer component, fill the text inputs and press the submit button

      await waitFor(() => {
        // expect the onSubmit function to have been called once and with a correct first argument
      });
    });
  });
});
```

</div>

<div class="content">

### Extending our application

<!-- It is time to put everything we have learned so far to good use and start extending our application. Our application still lacks a few important features such as reviewing a repository and registering a user. The upcoming exercises will focus on these essential features.-->
是时候利用我们迄今为止所学到的知识，开始扩展我们的应用程序了。我们的应用程序仍然缺少一些重要功能，如审查存储库和注册用户。接下来的练习将重点关注这些基本功能。

</div>

<div class="tasks">

### Exercises 10.19. - 10.26

#### Exercise 10.19: the single repository view

<!-- Implement a view for a single repository, which contains the same repository information as in the reviewed repositories list but also a button for opening the repository in GitHub. It would be a good idea to reuse the <em>RepositoryItem</em> component used in the <em>RepositoryList</em> component and display the GitHub repository button for example based on a boolean prop.-->
实现一个单个仓库的视图，其中包含与审查仓库列表中相同的仓库信息，还包含一个在GitHub中打开仓库的按钮。最好重用<em>RepositoryItem</em>组件，并基于布尔属性显示GitHub仓库按钮。

<!-- The repository's URL is in the <em>url</em> field of the <em>Repository</em> type in the GraphQL schema. You can fetch a single repository from the Apollo server with the <em>repository</em> query. The query has a single argument, which is the id of the repository. Here's a simple example of the <em>repository</em> query:-->
<em>url</em> 字段位于 GraphQL 模式中的 <em>Repository</em> 类型中。您可以使用 <em>repository</em> 查询从 Apollo 服务器获取单个存储库。该查询具有一个参数，即存储库的 id。以下是 <em>repository</em> 查询的简单示例：

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    url
  }
}
```

<!-- As always, test your queries in the Apollo Sandbox first before using them in your application. If you are unsure about the GraphQL schema or what are the available queries, take a look at the documentation next to the operations editor. If you have trouble using the id as a variable in the query, take a moment to study the Apollo Client''s [documentation](https://www.apollographql.com/docs/react/data/queries/) on queries.-->
一如既往，在在应用程序中使用查询之前，请先在Apollo沙盒中测试查询。如果不确定图形查询模式或可用查询，请参阅操作编辑器旁边的文档。如果您在查询中使用id作为变量时遇到问题，请花一点时间研究Apollo客户端[文档](https://www.apollographql.com/docs/react/data/queries/)上的查询。

<!-- To learn how to open a URL in a browser, read the Expo''s [Linking API documentation](https://docs.expo.dev/versions/latest/sdk/linking/). You will need this feature while implementing the button for opening the repository in GitHub. Hint: [Linking.openURL](https://docs.expo.dev/versions/latest/sdk/linking/#linkingopenurlurl) method will come in handy.-->
要学习如何在浏览器中开启URL，请阅读Expo的[Linking API文档](https://docs.expo.dev/versions/latest/sdk/linking/)。在实现打开GitHub存储库的按钮时，您将需要此功能。提示：[Linking.openURL](https://docs.expo.dev/versions/latest/sdk/linking/#linkingopenurlurl)方法会派上用场。

<!-- The view should have its own route. It would be a good idea to define the repository's id in the route's path as a path parameter, which you can access by using the [useParams](https://reactrouter.com/docs/en/v6/api#useparams) hook. The user should be able to access the view by pressing a repository in the reviewed repositories list. You can achieve this by for example wrapping the <em>RepositoryItem</em> with a [Pressable](https://reactnative.dev/docs/pressable) component in the <em>RepositoryList</em> component and using <em>navigate</em> function to change the route in an <em>onPress</em> event handler. You can access the <em>navigate</em> function with the [useNavigate](https://reactrouter.com/docs/en/v6/api#usenavigate) hook.-->
视图应该有自己的路由。最好在路由的路径中定义存储库的id作为路径参数，您可以通过使用[useParams](https://reactrouter.com/docs/en/v6/api#useparams) hook来访问它。用户应该能够通过在已审查存储库列表中按下存储库来访问该视图。您可以通过例如在<em>RepositoryList</em>组件中包装<em>RepositoryItem</em>并使用<em>navigate</em>函数在<em>onPress</em>事件处理程序中更改路由来实现这一点。您可以使用[useNavigate](https://reactrouter.com/docs/en/v6/api#usenavigate) hook访问<em>navigate</em>函数。

<!-- The final version of the single repository view should look something like this:-->
最终版本的单一存储库视图应该看起来像这样：

![Application preview](../../images/10/13.jpg)

<!-- **Note** if the peer depencendy issues prevent installing the library, try the *--legacy-peer-deps* option:-->
**注意**：如果对等依赖关系问题阻止安装库，请尝试使用*--legacy-peer-deps*选项：

```bash
npm install expo-linking --legacy-peer-deps
```

#### Exercise 10.20: repository''s review list

<!-- Now that we have a view for a single repository, let's display repository's reviews there. Repository's reviews are in the <em>reviews</em> field of the <em>Repository</em> type in the GraphQL schema. <em>reviews</em> is a similar paginated list as in the <em>repositories</em> query. Here's an example of getting reviews of a repository:-->
现在我们已经有了一个单个存储库的视图，让我们在那里显示存储库的评论。存储库的评论在GraphQL模式中的<em>reviews</em>字段中。 <em>reviews</em>是与<em>repositories</em>查询中的类似分页列表。以下是获取存储库评论的示例：

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    reviews {
      edges {
        node {
          id
          text
          rating
          createdAt
          user {
            id
            username
          }
        }
      }
    }
  }
}
```

<!-- Review's <em>text</em> field contains the textual review, <em>rating</em> field a numeric rating between 0 and 100, and <em>createdAt</em> the date when the review was created. Review's <em>user</em> field contains the reviewer''s information, which is of type <em>User</em>.-->
Review 的 <em>text</em> 字段包含文本评论，<em>rating</em> 字段是 0 到 100 之间的数字评分，以及 <em>createdAt</em> 评论创建的日期。Review 的 <em>user</em> 字段包含评论者的信息，类型为 <em>User</em>。

<!-- We want to display reviews as a scrollable list, which makes [FlatList](https://reactnative.dev/docs/flatlist) a suitable component for the job. To display the previous exercise's repository's information at the top of the list, you can use the <em>FlatList</em> components [ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent) prop. You can use the [ItemSeparatorComponent](https://reactnative.dev/docs/flatlist#itemseparatorcomponent) to add some space between the items like in the <em>RepositoryList</em> component. Here''s an example of the structure:-->
我们想要将评论以可滚动的列表形式显示，这使得[FlatList](https://reactnative.dev/docs/flatlist)成为这项工作的合适组件。要在列表顶部显示上一个练习的存储库信息，您可以使用<em>FlatList</em>组件的[ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent)属性。您可以使用[ItemSeparatorComponent](https://reactnative.dev/docs/flatlist#itemseparatorcomponent)在项目之间添加一些空间，就像<em>RepositoryList</em>组件中一样。这里是结构的示例：

```javascript
const RepositoryInfo = ({ repository }) => {
  // Repository''s information implemented in the previous exercise
};

const ReviewItem = ({ review }) => {
  // Single review item
};

const SingleRepository = () => {
  // ...

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      // ...
    />
  );
};

export default SingleRepository;
```

<!-- The final version of the repository''s reviews list should look something like this:-->
最终版本的存储库的评论列表应该看起来像这样：

![Application preview](../../images/10/14.jpg)

<!-- The date under the reviewer''s username is the creation date of the review, which is in the <em>createdAt</em> field of the <em>Review</em> type. The date format should be user-friendly such as <i>date.month.year</i>. You can for example install the [date-fns](https://date-fns.org/) library and use the [format](https://date-fns.org/v2.28.0/docs/format) function for formatting the creation date.-->
评论者用户名下的日期是评论的创建日期，它位于<em>Review</em>类型的<em>createdAt</em>字段中。日期格式应该是用户友好的，比如<i>date.month.year</i>。例如，您可以安装[date-fns](https://date-fns.org/)库并使用[format](https://date-fns.org/v2.28.0/docs/format)函数来格式化创建日期。

<!-- The round shape of the rating's container can be achieved with the <em>borderRadius</em> style property. You can make it round by fixing the container's <em>width</em> and <em>height</em> style property and setting the border-radius as <em>width / 2</em>.-->
评级容器的圆形外观可以通过<em>borderRadius</em>样式属性实现。你可以通过设置容器的<em>width</em>和<em>height</em>样式属性并将border-radius设置为<em>width / 2</em>来使其变得圆滑。

#### Exercise 10.21: the review form

<!-- Implement a form for creating a review using Formik. The form should have four fields: repository owner's GitHub username (for example "jaredpalmer"), repository's name (for example "formik"), a numeric rating, and a textual review. Validate the fields using Yup schema so that it contains the following validations:-->
实施一个使用Formik创建评论的表单。该表单应有四个字段：存储库所有者的GitHub用户名（例如“jaredpalmer”），存储库的名称（例如“formik”），数字评分和文字评论。使用Yup模式验证字段，以便其包含以下验证：

<!-- - Repository owner''s username is a required string-->
仓库所有者的用户名是必需的字符串
<!-- - Repository''s name is a required string-->
仓库名称为必填字符串
<!-- - Rating is a required number between 0 and 100-->
**评分是一个0到100之间的必需数字**
<!-- - Review is a optional string-->
# 点评是一个可选的字符串

<!-- Explore Yup's [documentation](https://github.com/jquense/yup#yup) to find suitable validators. Use sensible error messages with the validators. The validation message can be defined as the validator method's <em>message</em> argument. You can make the review field expand to multiple lines by using <em>TextInput</em> component''s [multiline](https://reactnative.dev/docs/textinput#multiline) prop.-->
探索Yup的[文档](https://github.com/jquense/yup#yup)以找到合适的验证器。使用合理的错误消息与验证器一起使用。验证消息可以定义为验证器方法的<em>message</em>参数。您可以通过使用<em>TextInput</em>组件的[multiline](https://reactnative.dev/docs/textinput#multiline) prop来使审查字段扩展到多行。

<!-- You can create a review using the <em>createReview</em> mutation. Check this mutation''s arguments in the Apollo Sandbox. You can use the [useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation) hook to send a mutation to the Apollo Server.-->
你可以使用<em>createReview</em> mutation创建一个review。在Apollo Sandbox中检查这个mutation的参数。你可以使用[useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation) hook将mutation发送到Apollo Server。

<!-- After a successful <em>createReview</em> mutation, redirect the user to the repository's view you implemented in the previous exercise. This can be done with the <em>navigate</em> function after you have obtained it using the [useNavigate](https://reactrouter.com/docs/en/v6/api#usenavigate) hook. The created review has a <em>repositoryId</em> field which you can use to construct the route's path.-->
在成功执行<em>createReview</em>变更后，使用[useNavigate](https://reactrouter.com/docs/en/v6/api#usenavigate)钩子获取的<em>navigate</em>函数将用户重定向到之前练习中实现的仓库视图。创建的评论有一个<em>repositoryId</em>字段，可以使用它来构造路由的路径。

<!-- To prevent getting cached data with the <em>repository</em> query in the single repository view, use the *cache-and-network* [fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy) in the query. It can be used with the <em>useQuery</em> hook like this:-->
要防止在单个存储库视图中使用<em>存储库</em>查询获取缓存数据，请在查询中使用*cache-and-network* [fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy)。 它可以像这样与<em>useQuery</em>钩子一起使用：

```javascript
useQuery(GET_REPOSITORY, {
  fetchPolicy: 'cache-and-network',
  // Other options
});
```

<!-- Note that only <i>an existing public GitHub repository</i> can be reviewed and a user can review the same repository <i>only once</i>. You don''t have to handle these error cases, but the error payload includes specific codes and messages for these errors. You can try out your implementation by reviewing one of your own public repositories or any other public repository.-->
注意，只有<i>现有的公共GitHub存储库</i>才能被审查，用户只能<i>一次</i>审查同一个存储库。您不必处理这些错误情况，但错误有效负载包括这些错误的特定代码和消息。您可以通过审查自己的公共存储库或任何其他公共存储库来尝试实现。

<!-- The review form should be accessible through the app bar. Create a tab to the app bar with a label "Create a review". This tab should only be visible to users who have signed in. You will also need to define a route for the review form.-->
应该通过应用栏访问评论表格。在应用栏上创建一个标签为“创建评论”的标签。只有登录用户才能看到此标签。您还需要为评论表格定义一个路由。

<!-- The final version of the review form should look something like this:-->
最终版本的审核表应该看起来像这样：

![Application preview](../../images/10/15.jpg)

<!-- This screenshot has been taken after invalid form submission to present what the form should look like in an invalid state.-->
这张截图是在无效表单提交后拍摄的，以展示表单在无效状态下应该是什么样子的。

#### Exercise 10.22: the sign up form

<!-- Implement a sign up form for registering a user using Formik. The form should have three fields: username, password, and password confirmation. Validate the form using Yup schema so that it contains the following validations:-->
实现一个使用Formik注册用户的注册表单。表单应该有三个字段：用户名，密码和密码确认。使用Yup模式验证表单，以便其包含以下验证：

<!-- - Username is a required string with a length between 1 and 30-->
用户名是一个长度在1到30之间的必填字符串。
<!-- - Password is a required string with a length between 5 and 50-->
密码是一个长度在5到50之间的必需字符串。
<!-- - Password confirmation matches the password-->
密码确认与密码匹配

<!-- The password confirmation field''s validation can be a bit tricky, but it can be done for example by using the [oneOf](https://github.com/jquense/yup#schemaoneofarrayofvalues-arrayany-message-string--function-schema-alias-equals) and [ref](https://github.com/jquense/yup#refpath-string-options--contextprefix-string--ref) methods like suggested in [this issue](https://github.com/jaredpalmer/formik/issues/90#issuecomment-354873201).-->
密码确认字段的验证可能有点棘手，但可以像[这个问题](https://github.com/jaredpalmer/formik/issues/90#issuecomment-354873201)中建议的那样使用[oneOf](https://github.com/jquense/yup#schemaoneofarrayofvalues-arrayany-message-string--function-schema-alias-equals)和[ref](https://github.com/jquense/yup#refpath-string-options--contextprefix-string--ref)方法来实现。

<!-- You can create a new user by using the <em>createUser</em> mutation. Find out how this mutation works by exploring the documentation in the Apollo Sandbox. After a successful <em>createUser</em> mutation, sign the created user in by using the <em>useSignIn</em> hook as we did in the sign in the form. After the user has been signed in, redirect the user to the reviewed repositories list view.-->
你可以通过使用<em>createUser</em>变异来创建新用户。通过在Apollo沙箱中探索文档来了解这个变异是如何工作的。成功执行<em>createUser</em>变异后，使用<em>useSignIn</em>钩子将创建的用户登录，就像我们在登录表单中所做的那样。用户登录后，将其重定向到已审阅仓库列表视图。

<!-- The user should be able to access the sign-up form through the app bar by pressing a "Sign up" tab. This tab should only be visible to users that aren''t signed in.-->
用户应该能够通过按下“注册”标签来访问应用栏上的注册表单。只有未登录的用户才能看到这个标签。

<!-- The final version of the sign up form should look something like this:-->
最终版本的注册表格应该看起来像这样：

![Application preview](../../images/10/16.jpg)

<!-- This screenshot has been taken after invalid form submission to present what the form should look like in an invalid state.-->
这张截图是在无效表单提交后拍摄的，以展示表单在无效状态下的样子。

#### Exercise 10.23: sorting the reviewed repositories list

<!-- At the moment repositories in the reviewed repositories list are ordered by the date of repository''s first review. Implement a feature that allows users to select the principle, which is used to order the repositories. The available ordering principles should be:-->
目前，在审查仓库列表中的仓库按照仓库首次审查的日期进行排序。实现一个功能，允许用户选择用于排序仓库的原则。可用的排序原则应该是：

<!-- - Latest repositories. The repository with the latest first review is on the top of the list. This is the current behavior and should be the default principle.-->
最新的存储库。第一次审查的存储库排在列表顶部。这是当前的行为，应该是默认原则。
<!-- - Highest rated repositories. The repository with the <i>highest</i> average rating is on the top of the list.-->
- 最高评级的存储库。拥有<i>最高</i>平均评级的存储库位于列表首位。
<!-- - Lowest rated repositories. The repository with the <i>lowest</i> average rating is on the top of the list.-->
- 最低评分仓库。排在列表首位的仓库是平均评分<i>最低</i>的。

<!-- The <em>repositories</em> query used to fetch the reviewed repositories has an argument called <em>orderBy</em>, which you can use to define the ordering principle. The argument has two allowed values: CREATED\_AT (order by the date of repository's first review) and RATING\_AVERAGE, (order by the repository's average rating). The query also has an argument called <em>orderDirection</em> which can be used to change the order direction. The argument has two allowed values: <em>ASC</em> (ascending, smallest value first) and <em>DESC</em> (descending, biggest value first).-->
<em>仓库</em>查询用于提取审核过的仓库，其中有一个参数叫做<em>orderBy</em>，可以用来定义排序原则。该参数有两个允许的值：CREATED\_AT（按仓库第一次审核的日期排序）和RATING\_AVERAGE（按仓库的平均评分排序）。查询还有一个参数叫做<em>orderDirection</em>，可以用来改变排序方向。该参数有两个允许的值：<em>ASC</em>（升序，最小值优先）和<em>DESC</em>（降序，最大值优先）。

<!-- The selected ordering principle state can be maintained for example using the React''s [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook. The variables used in the <em>repositories</em> query can be given to the <em>useRepositories</em> hook as an argument.-->
使用 React 的 [useState](https://reactjs.org/docs/hooks-reference.html#usestate) 钩子可以维持所选择的排序原则状态。可以将 <em>repositories</em> 查询中使用的变量作为参数传给 <em>useRepositories</em> 钩子。

<!-- You can use for example [@react-native-picker/picker](https://docs.expo.io/versions/latest/sdk/picker/) library, or [React Native Paper](https://callstack.github.io/react-native-paper/) library's [Menu](https://callstack.github.io/react-native-paper/menu.html) component to implement the ordering principle's selection. You can use the <em>FlatList</em> component''s [ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent) prop to provide the list with a header containing the selection component.-->
你可以使用例如[@react-native-picker/picker](https://docs.expo.io/versions/latest/sdk/picker/)库，或[React Native Paper](https://callstack.github.io/react-native-paper/)库的[Menu](https://callstack.github.io/react-native-paper/menu.html)组件来实现排序原则的选择。你可以使用<em>FlatList</em>组件的[ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent)属性，提供列表的头部包含选择组件。

<!-- The final version of the feature, depending on the selection component in use, should look something like this:-->
最终版本的功能，取决于使用的选择组件，应该看起来像这样：

![Application preview](../../images/10/17.jpg)

#### Exercise 10.24: filtering the reviewed repositories list

<!-- The Apollo Server allows filtering repositories using the repository's name or the owner's username. This can be done using the <em>searchKeyword</em> argument in the <em>repositories</em> query. Here''s an example of how to use the argument in a query:-->
Apollo Server允许使用仓库的名称或所有者的用户名来过滤仓库。 这可以通过在`repositories`查询中使用`searchKeyword`参数来完成。 以下是如何在查询中使用该参数的示例：

```javascript
{
  repositories(searchKeyword: "ze") {
    edges {
      node {
        id
        fullName
      }
    }
  }
}
```

<!-- Implement a feature for filtering the reviewed repositories list based on a keyword. Users should be able to type in a keyword into a text input and the list should be filtered as the user types. You can use a simple <em>TextInput</em> component or something a bit fancier such as React Native Paper's [Searchbar](https://callstack.github.io/react-native-paper/searchbar.html) component as the text input. Put the text input component in the <em>FlatList</em> component's header.-->
实现一个功能，可以根据关键字过滤审查过的存储库列表。用户应该能够在文本输入框中输入关键字，并且随着用户输入而过滤列表。您可以使用简单的<em>TextInput</em>组件或更加漂亮的React Native Paper的[Searchbar](https://callstack.github.io/react-native-paper/searchbar.html)组件作为文本输入。将文本输入组件放在<em>FlatList</em>组件的头部。

<!-- To avoid a multitude of unnecessary requests while the user types the keyword fast, only pick the latest input after a short delay. This technique is often referred to as [debouncing](https://lodash.com/docs/4.17.15#debounce). [use-debounce](https://www.npmjs.com/package/use-debounce) library is a handy hook for debouncing a state variable. Use it with a sensible delay time, such as 500 milliseconds. Store the text input''s value by using the <em>useState</em> hook and then pass the debounced value to the query as the value of the <em>searchKeyword</em> argument.-->
为了避免用户输入关键字时发出大量不必要的请求，只在短暂延迟后选取最新的输入。这一技术通常被称为[防抖](https://lodash.com/docs/4.17.15#debounce)。[use-debounce](https://www.npmjs.com/package/use-debounce)库是一个方便的钩子，用于防抖动状态变量。使用合理的延迟时间，如500毫秒。使用<em>useState</em>钩子存储文本输入的值，然后将防抖值作为<em>searchKeyword</em>参数的值传递给查询。

<!-- You probably face an issue that the text input component loses focus after each keystroke. This is because the content provided by the <em>ListHeaderComponent</em> prop is constantly unmounted. This can be fixed by turning the component rendering the <em>FlatList</em> component into a class component and defining the header''s render function as a class property like this:-->
你可能会遇到一个问题，即每按下一次键后，文本输入组件就会失去焦点。这是因为<em>ListHeaderComponent</em> prop提供的内容不断卸载。可以通过将渲染<em>FlatList</em>组件的组件转换为类组件，并将标题的render函数定义为类属性来解决这个问题，如下所示：

```javascript
export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    // this.props contains the component''s props
    const props = this.props;

    // ...

    return (
      <RepositoryListHeader
      // ...
      />
    );
  };

  render() {
    return (
      <FlatList
        // ...
        ListHeaderComponent={this.renderHeader}
      />
    );
  }
}
```

<!-- The final version of the filtering feature should look something like this:-->
最终版本的过滤功能应该看起来像这样：

![Application preview](../../images/10/18.jpg)

#### Exercise 10.25: the user''s reviews view

<!-- Implement a feature which allows user to see their reviews. Once signed in, the user should be able to access this view by pressing a "My reviews" tab in the app bar. Here is what the review list view should roughly look like:-->
实现一个功能，允许用户查看他们的评论。一旦登录，用户应该能够通过在应用程序栏中按“我的评论”选项卡来访问此视图。以下是评论列表视图的大致外观：

![Application preview](../../images/10/20.jpg)

<!-- Remember that you can fetch the authenticated user from the Apollo Server with the <em>me</em> query. This query returns a <em>User</em> type, which has a field <em>reviews</em>. If you have already implemented a reusable <em>me</em> query in your code, you can customize this query to fetch the <em>reviews</em> field conditionally. This can be done using GraphQL''s [include](https://graphql.org/learn/queries/#directives) directive.-->
记住，您可以使用<em>me</em>查询从Apollo服务器获取认证用户。该查询返回一个<em>User</em>类型，其中包含一个字段<em>reviews</em>。如果您已经在代码中实现了可重用的<em>me</em>查询，则可以使用GraphQL的[include](https://graphql.org/learn/queries/#directives)指令条件性地获取<em>reviews</em>字段。

<!-- Let''s say that the current query is implemented roughly in the following manner:-->
让我们说当前的查询大致以下面的方式实现：

```javascript
const GET_CURRENT_USER = gql`
  query {
    me {
      # user fields...
    }
  }
`;
```

<!-- You can provide the query with an <em>includeReviews</em> argument and use that with the <em>include</em> directive:-->
你可以给查询提供一个<em>includeReviews</em>参数，并使用<em>include</em>指令：

```javascript
const GET_CURRENT_USER = gql`
  query getCurrentUser($includeReviews: Boolean = false) {
    me {
      # user fields...
      reviews @include(if: $includeReviews) {
        edges {
          node {
            # review fields...
          }
        }
      }
    }
  }
`;
```

<!-- The <em>includeReviews</em> argument has a default value of <em>false</em>, because we don't want to cause additional server overhead unless we explicitly want to fetch authenticated user's reviews. The principle of the <em>include</em> directive is quite simple: if the value of the <em>if</em> argument is <em>true</em>, include the field, otherwise omit it.-->
<em>includeReviews</em>参数的默认值为<em>false</em>，因为我们不想除非明确想要获取认证用户的评论，否则就不要造成额外的服务器开销。<em>include</em>指令的原则很简单：如果<em>if</em>参数的值为<em>true</em>，则包含该字段，否则忽略它。

#### Exercise 10.26: review actions

<!-- Now that user can see their reviews, let's add some actions to the reviews. Under each review on the review list, there should be two buttons. One button is for viewing the review's repository. Pressing this button should take the user to the single repository review implemented in the previous exercise. The other button is for deleting the review. Pressing this button should delete the review. Here is what the actions should roughly look like:-->
现在用户可以看到他们的评论，让我们在评论列表中添加一些操作。在每个评论下方，应该有两个按钮。一个按钮是查看评论的库。按下此按钮应该会将用户带到前一个练习中实现的单个库评论。另一个按钮是用于删除评论。按下此按钮应该会删除评论。这里是操作大致应该看起来像什么：

![Application preview](../../images/10/21.jpg)

<!-- Pressing the delete button should be followed by a confirmation alert. If the user confirms the deletion, the review is deleted. Otherwise, the deletion is discarded. You can implement the confirmation using the [Alert](https://reactnative.dev/docs/alert) module. Note that calling the <em>Alert.alert</em> method won''t open any window in Expo web preview. Use either Expo mobile app or an emulator to see the what the alert window looks like.-->
按下删除按钮应该跟随着一个确认警报。如果用户确认删除，评论就会被删除。否则，删除会被取消。你可以使用[警报](https://reactnative.dev/docs/alert)模块来实现确认。注意，调用<em>Alert.alert</em>方法不会在Expo web预览中打开任何窗口。使用Expo移动应用程序或模拟器来查看警报窗口的外观。

<!-- Here is the confirmation alert that should pop out once the user presses the delete button:-->
**确认删除**
您确定要删除吗？

![Application preview](../../images/10/22.jpg)

<!-- You can delete a review using the <em>deleteReview</em> mutation. This mutation has a single argument, which is the id of the review to be deleted. After the mutation has been performed, the easiest way to update the review list''s query is to call the [refetch](https://www.apollographql.com/docs/react/data/queries/#refetching) function.-->
你可以使用<em> deleteReview </em>变异来删除评论。此变异有一个参数，即要删除的评论的ID。在执行变异后，更新评论列表查询的最简单方法是调用[refetch](https://www.apollographql.com/docs/react/data/queries/#refetching)函数。

</div>

<div class="content">

### Cursor-based pagination

<!-- When an API returns an ordered list of items from some collection, it usually returns a subset of the whole set of items to reduce the required bandwidth and to decrease the memory usage of the client applications. The desired subset of items can be parameterized so that the client can request for example the first twenty items on the list after some index. This technique is commonly referred to as <i>pagination</i>. When items can be requested after a certain item defined by a <i>cursor</i>, we are talking about <i>cursor-based pagination</i>.-->
当API从某个集合中返回一个有序的项目列表时，它通常只返回整个集合的一个子集，以减少所需的带宽，并减少客户端应用程序的内存使用量。所需的子集项目可以参数化，以便客户端可以请求某个索引后的前二十项。这种技术通常被称为<i>分页</i>。当可以在由<i>光标</i>定义的某个项目之后请求项目时，我们谈论的是<i>基于光标的分页</i>。

<!-- So cursor is just a serialized presentation of an item in an ordered list. Let''s have a look at the paginated repositories returned by the <em>repositories</em> query using the following query:-->
所以光标只是一个有序列表中项目的序列化呈现。让我们看一下用下面的查询返回的分页存储库：<em>存储库</em>查询：

```javascript
{
  repositories(first: 2) {
    totalCount
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
    }
  }
}
```

<!-- The <em>first</em> argument tells the API to return only the first two repositories. Here''s an example of a result of the query:-->
<em>第一</em>个参数告诉API只返回前两个存储库。下面是查询结果的一个例子：

```javascript
{
  "data": {
    "repositories": {
      "totalCount": 10,
      "edges": [
        {
          "node": {
            "id": "zeit.next.js",
            "fullName": "zeit/next.js",
            "createdAt": "2020-05-15T11:59:57.557Z"
          },
          "cursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd"
        },
        {
          "node": {
            "id": "zeit.swr",
            "fullName": "zeit/swr",
            "createdAt": "2020-05-15T11:58:53.867Z"
          },
          "cursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10="
        }
      ],
      "pageInfo": {
        "endCursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=",
        "startCursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd",
        "hasNextPage": true
      }
    }
  }
}
```

<!-- The format of the result object and the arguments are based on the [Relay's GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm), which has become a quite common pagination specification and has been widely adopted for example in the [GitHub's GraphQL API](https://docs.github.com/en/graphql). In the result object, we have the <em>edges</em> array containing items with <em>node</em> and <em>cursor</em> attributes. As we know, the <em>node</em> contains the repository itself. The <em>cursor</em> on the other hand is a Base64 encoded representation of the node. In this case, it contains the repository's id and date of repository's creation as a timestamp. This is the information we need to point to the item when they are ordered by the creation time of the repository. The <em>pageInfo</em> contains information such as the cursor of the first and the last item in the array.-->
根据[Relay 的 GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm)，结果对象的格式和参数已经成为一种相当普遍的分页规范，并且已经被[GitHub 的 GraphQL API](https://docs.github.com/en/graphql)广泛采用。在结果对象中，我们有一个包含具有<em>node</em>和<em>cursor</em>属性的项目的<em>edges</em>数组。众所周知，<em>node</em>包含了存储库本身。另一方面，<em>cursor</em>是节点的Base64编码表示。在这种情况下，它包含存储库的ID和存储库创建的时间戳。当按存储库的创建时间排序时，这就是我们需要指向该项目的信息。<em>pageInfo</em>包含诸如数组中第一个和最后一个项目的游标等信息。

<!-- Let''s say that we want to get the next set of items <i>after</i> the last item of the current set, which is the "zeit/swr" repository. We can set the <em>after</em> argument of the query as the value of the <em>endCursor</em> like this:-->
让我们假设我们想要在当前集合的最后一个项目“zeit/swr”之后获取下一组项目。我们可以将查询的<em>after</em>参数设置为<em>endCursor</em>的值，如下所示：

```javascript
{
  repositories(first: 2, after: "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=") {
    totalCount
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
    }
  }
}
```

<!-- Now that we have the next two items and we can keep on doing this until the <em>hasNextPage</em> has the value <em>false</em>, meaning that we have reached the end of the list. To dig deeper into cursor-based pagination, read Shopify''s article [Pagination with Relative Cursors](https://engineering.shopify.com/blogs/engineering/pagination-relative-cursors). It provides great details on the implementation itself and the benefits over the traditional index-based pagination.-->
现在我们已经有了下两个项目，我们可以继续这样做，直到<em>hasNextPage</em>的值为<em>false</em>，这意味着我们已经到达了列表的末尾。要更深入地了解基于游标的分页，请阅读Shopify的文章[Pagination with Relative Cursors](https://engineering.shopify.com/blogs/engineering/pagination-relative-cursors)。它提供了有关实施本身和传统索引分页的好处的详细信息。

### Infinite scrolling

<!-- Vertically scrollable lists in mobile and desktop applications are commonly implemented using a technique called <i>infinite scrolling</i>. The principle of infinite scrolling is quite simple:-->
<i>无限滚动</i>是一种常见的在移动端和桌面应用中实现垂直滚动列表的技术。无限滚动的原理非常简单：

<!-- - Fetch the initial set of items-->
取得最初的一组项目
<!-- - When the user reaches the last item, fetch the next set of items after the last item-->
当用户到达最后一个项目时，获取最后一个项目后的下一组项目。

<!-- The second step is repeated until the user gets tired of scrolling or some scrolling limit is exceeded. The name "infinite scrolling" refers to the way the list seems to be infinite - the user can just keep on scrolling and new items keep on appearing on the list.-->
第二步重复进行，直到用户厌倦滚动或者超过某个滚动限制。“无限滚动”这个名称指的是列表似乎是无限的方式，用户可以一直滚动，而新项目会不断出现在列表中。

<!-- Let's have a look at how this works in practice using the Apollo Client's <em>useQuery</em> hook. Apollo Client has a great [documentation](https://www.apollographql.com/docs/react/pagination/cursor-based/) on implementing the cursor-based pagination. Let''s implement infinite scrolling for the reviewed repositories list as an example.-->
让我们看一下这在实践中如何使用 Apollo Client 的<em>useQuery</em>钩子。Apollo Client 在实现基于游标的分页上有很好的[文档](https://www.apollographql.com/docs/react/pagination/cursor-based/)。让我们以评论仓库列表为例来实现无限滚动。

<!-- First, we need to know when the user has reached the end of the list. Luckily, the <em>FlatList</em> component has a prop [onEndReached](https://reactnative.dev/docs/flatlist#onendreached), which will call the provided function once the user has scrolled to the last item on the list. You can change how early the <em>onEndReach</em> callback is called using the [onEndReachedThreshold](https://reactnative.dev/docs/flatlist#onendreachedthreshold) prop. Alter the <em>RepositoryList</em> component''s <em>FlatList</em> component so that it calls a function once the end of the list is reached:-->
首先，我们需要知道用户何时到达列表的末尾。幸运的是，<em>FlatList</em>组件有一个属性[onEndReached]（https://reactnative.dev/docs/flatlist#onendreached），它会在用户滚动到列表的最后一项时调用提供的函数。您可以使用[onEndReachedThreshold]（https://reactnative.dev/docs/flatlist#onendreachedthreshold）属性更改<em>onEndReach</em>回调被调用的早晚。更改<em>RepositoryList</em>组件的<em>FlatList</em>组件，以便在到达列表末尾时调用函数：

```javascript
export const RepositoryListContainer = ({
  repositories,
  onEndReach,
  /* ... */,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

const RepositoryList = () => {
  // ...

  const { repositories } = useRepositories(/* ... */);

  const onEndReach = () => {
    console.log('You have reached the end of the list');
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      // ...
    />
  );
};

export default RepositoryList;
```

<!-- Try scrolling to the end of the reviewed repositories list and you should see the message in the logs.-->
试着滚动到审核仓库列表的末尾，你应该能在日志中看到消息。

<!-- Next, we need to fetch more repositories once the end of the list is reached. This can be achieved using the [fetchMore](https://www.apollographql.com/docs/react/pagination/core-api/#the-fetchmore-function) function provided by the <em>useQuery</em> hook. To describe Apollo Client, how to merge the existing repositories in the cache with the next set of repositories, we can use a [field policy](https://www.apollographql.com/docs/react/caching/cache-field-behavior/). In general, field policies can be used to customize the cache behavior during read and write operations with [read](https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-read-function) and [merge](https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function) functions.-->
接下来，当到达列表末尾时，我们需要获取更多仓库。这可以使用<em>useQuery</em>提供的[fetchMore](https://www.apollographql.com/docs/react/pagination/core-api/#the-fetchmore-function)函数来实现。要描述Apollo Client如何将现有仓库与下一组仓库合并，我们可以使用[字段策略](https://www.apollographql.com/docs/react/caching/cache-field-behavior/)。一般来说，字段策略可用于在读取和写入操作期间自定义缓存行为，使用[读取](https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-read-function)和[合并](https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function)函数。

<!-- Let''s add a field policy for the <em>repositories</em> query in the <i>apolloClient.js</i> file:-->
让我们在`apolloClient.js`文件中为`repositories`查询添加一个字段策略：

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';
import { relayStylePagination } from '@apollo/client/utilities'; // highlight-line

const { apolloUri } = Constants.manifest.extra;

const httpLink = createHttpLink({
  uri: apolloUri,
});

// highlight-start
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination(),
      },
    },
  },
});
// highlight-end

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
    cache, // highlight-line
  });
};

export default createApolloClient;
```

<!-- As mentioned earlier, the format of the pagination's result object and the arguments are based on the Relay's pagination specification. Luckily, Apollo Client provides a predefined field policy, <em>relayStylePagination</em>, which can be used in this case.-->
正如前面提到的，分页结果对象的格式和参数基于Relay的分页规范。幸运的是，Apollo Client提供了一个预定义的字段策略<em>relayStylePagination</em>，可以在这种情况下使用。

<!-- Next, let''s alter the <em>useRepositories</em> hook so that it returns a decorated <em>fetchMore</em> function, which calls the actual <em>fetchMore</em> function with appropriate arguments so that we can fetch the next set of repositories:-->
接下来，让我们更改<em>useRepositories</em>钩子，以便它返回一个装饰过的<em>fetchMore</em>函数，该函数使用适当的参数调用实际的<em>fetchMore</em>函数，以便我们可以获取下一组存储库：

```javascript
const useRepositories = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables,
    // ...
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};
```

<!-- Make sure you have the <em>pageInfo</em> and the <em>cursor</em> fields in your <em>repositories</em> query as described in the pagination examples. You will also need to include the <em>after</em> and <em>first</em> arguments for the query.-->
确保您的<em>repositories</em>查询中包含<em>pageInfo</em>和<em>cursor</em>字段，如分页示例所述。 您还需要包括查询的<em>after</em>和<em>first</em>参数。

<!-- The <em>handleFetchMore</em> function will call the Apollo Client''s <em>fetchMore</em> function if there are more items to fetch, which is determined by the <em>hasNextPage</em> property. We also want to prevent fetching more items if fetching is already in process. In this case, <em>loading</em> will be <em>true</em>. In the <em>fetchMore</em> function we are providing the query with an <em>after</em> variable, which receives the latest <em>endCursor</em> value.-->
<em>handleFetchMore</em> 函数将调用 Apollo Client 的 <em>fetchMore</em> 函数，如果有更多的项目要获取，这取决于 <em>hasNextPage</em> 属性。我们还希望在正在获取时防止获取更多项目。在这种情况下，<em>loading</em> 为 <em>true</em>。在 <em>fetchMore</em> 函数中，我们为查询提供了一个 <em>after</em> 变量，它接收最新的 <em>endCursor</em> 值。

<!-- The final step is to call the <em>fetchMore</em> function in the <em>onEndReach</em> handler:-->
最后一步是在<em>onEndReach</em>处理程序中调用<em>fetchMore</em>函数：

```javascript
const RepositoryList = () => {
  // ...

  const { repositories, fetchMore } = useRepositories({
    first: 8,
    // ...
  });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      // ...
    />
  );
};

export default RepositoryList;
```

<!-- Use a relatively small <em>first</em> argument value such as 3 while trying out the infinite scrolling. This way you don''t need to review too many repositories. You might face an issue that the <em>onEndReach</em> handler is called immediately after the view is loaded. This is most likely because the list contains so few repositories that the end of the list is reached immediately. You can get around this issue by increasing the value of <em>first</em> argument. Once you are confident that the infinite scrolling is working, feel free to use a larger value for the <em>first</em> argument.-->
使用相对较小的<em>first</em>参数值，比如3，尝试无限滚动。这样您就不需要查看太多的存储库。您可能会遇到一个问题，即在视图加载后立即调用<em>onEndReach</em>处理程序。这很可能是因为列表包含的存储库很少，因此立即到达列表的末尾。您可以通过增加<em>first</em>参数的值来解决此问题。一旦您确信无限滚动正常工作，请随意使用<em>first</em>参数的更大值。

</div>

<div class="tasks">

### Exercise 10.27

#### Exercise 10.27: infinite scrolling for the repository''s reviews list

<!-- Implement infinite scrolling for the repository's reviews list. The <em>Repository</em> type's <em>reviews</em> field has the <em>first</em> and <em>after</em> arguments similar to the <em>repositories</em> query. <em>ReviewConnection</em> type also has the <em>pageInfo</em> field just like the <em>RepositoryConnection</em> type.-->
实现仓库评论列表的无限滚动。<em>Repository</em>类型的<em>reviews</em>字段具有与<em>repositories</em>查询相似的<em>first</em>和<em>after</em>参数。<em>ReviewConnection</em>类型也具有与<em>RepositoryConnection</em>类型相同的<em>pageInfo</em>字段。

<!-- Here''s an example query:-->
这是一个例子查询：

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    reviews(first: 2, after: "WyIxYjEwZTRkOC01N2VlLTRkMDAtODg4Ni1lNGEwNDlkN2ZmOGYuamFyZWRwYWxtZXIuZm9ybWlrIiwxNTg4NjU2NzUwMDgwXQ==") {
      totalCount
      edges {
        node {
          id
          text
          rating
          createdAt
          repositoryId
          user {
            id
            username
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
      }
    }
  }
}
```

<!-- The cache''s field policy can be similar as with the <em>repositories</em> query:-->
缓存的字段策略可以与<em>仓库</em>查询类似：

```javascript
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination(),
      },
    },
    // highlight-start
    Repository: {
      fields: {
        reviews: relayStylePagination(),
      },
    },
    // highlight-end
  },
});
```

<!-- As with the reviewed repositories list, use a relatively small <em>first</em> argument value while you are trying out the infinite scrolling. You might need to create a few new users and use them to create a few new reviews to make the reviews list long enough to scroll. Set the value of the <em>first</em> argument high enough so that the <em>onEndReach</em> handler isn''t called immediately after the view is loaded, but low enough so that you can see that more reviews are fetched once you reach the end of the list. Once everything is working as intended you can use a larger value for the <em>first</em> argument.-->
随着审查仓库列表，在尝试无限滚动时，使用相对较小的<em>first</em>参数值。您可能需要创建一些新用户，并使用它们来创建一些新评论，以使评论列表足够长，可以滚动。将<em>first</em>参数的值设置得足够高，以便在加载视图后不立即调用<em>onEndReach</em>处理程序，但足够低，以便您可以看到更多评论在到达列表末尾时被获取。一旦一切按预期工作，您可以使用更大的<em>first</em>参数值。

<!-- This was the last exercise in this section. It''s time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Note that exercises in this section should be submitted to the part 4 in the exercise submission system.-->
这是本节的最后一个练习。是时候把你的代码推送到GitHub，并将所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020)中。请注意，本节的练习应提交到练习提交系统的第4部分。

</div>

<div class="content">

### Additional resources

<!-- As we are getting closer to the end of this part, let's take a moment to look at some additional React Native related resources. [Awesome React Native](https://github.com/jondot/awesome-react-native) is an extremely encompassing curated list of React Native resources such as libraries, tutorials, and articles. Because the list is exhaustively long, let's have a closer look at few of its highlights-->
.

随著我们越来越接近本部分的结束，让我们花一点时间来看看一些额外的 React Native 相关资源。[Awesome React Native](https://github.com/jondot/awesome-react-native) 是一份涵盖性极强的 React Native 资源精选列表，包含了许多函式库、教学文章和文章。由于该列表极为详尽，让我们来看看其中的一些重点吧。

#### React Native Paper

<!-- > Paper is a collection of customizable and production-ready components for React Native, following Google’s Material Design guidelines.-->
> 纸是一个为React Native定制和准备好生产的组件集合，遵循谷歌的Material Design指南。

<!-- [React Native Paper](https://callstack.github.io/react-native-paper/) is for React Native what [Material-UI](https://material-ui.com/) is for React web applications. It offers a wide range of high-quality UI components, support for [custom themes](https://callstack.github.io/react-native-paper/docs/guides/theming/) and a fairly simple [setup](https://callstack.github.io/react-native-paper/docs/guides/getting-started) for Expo based React Native applications.-->
[React Native Paper](https://callstack.github.io/react-native-paper/) 对于 React Native 来说，就像 [Material-UI](https://material-ui.com/) 对于 React 网页应用程序一样。它提供了广泛的高质量的 UI 组件，支持 [自定义主题](https://callstack.github.io/react-native-paper/docs/guides/theming/)，并且为基于 Expo 的 React Native 应用程序提供了一个相当简单的 [设置](https://callstack.github.io/react-native-paper/docs/guides/getting-started)。

#### Styled-components

<!-- > Utilising tagged template literals (a recent addition to JavaScript) and the power of CSS, styled-components allows you to write actual CSS code to style your components. It also removes the mapping between components and styles – using components as a low-level styling construct could not be easier!-->
> 利用标记模板文字（JavaScript的最新添加功能）和CSS的力量，styled-components可以让您编写实际的CSS代码来设计组件。它还消除了组件和样式之间的映射 - 使用组件作为低级别的样式构造再也不能更容易了！

<!-- [Styled-components](https://styled-components.com/) is a library for styling React components using [CSS-in-JS](https://en.wikipedia.org/wiki/CSS-in-JS) technique. In React Native we are already used to defining component''s styles as a JavaScript object, so CSS-in-JS is not so uncharted territory. However, the approach of styled-components is quite different from using the <em>StyleSheet.create</em> method and the <em>style</em> prop.-->
[styled-components](https://styled-components.com/) 是一个使用[CSS-in-JS](https://en.wikipedia.org/wiki/CSS-in-JS)技术来样式化React组件的库。在React Native中，我们已经习惯于将组件的样式定义为JavaScript对象，因此CSS-in-JS并不是太陌生的领域。但是，styled-components的方法与使用<em>StyleSheet.create</em>方法和<em>style</em> prop有很大的不同。

<!-- In styled-components components'' styles are defined with the component using a feature called [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) or a plain JavaScript object. Styled-components makes it possible to define new style properties for component based on its props *at runtime*. This brings many possibilities, such as seamlessly switching between a light and a dark theme. It also has a full [theming support](https://styled-components.com/docs/advanced#theming). Here is an example of creating a <em>Text</em> component with style variations based on props:-->
在styled-components组件中，使用一种叫做[标记式模板文字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)或者是普通的JavaScript对象来定义组件的样式。styled-components使得基于组件的属性*在运行时*定义新的样式属性成为可能。这带来了许多可能性，比如无缝地在浅色和深色主题之间切换。它也有完整的[主题支持](https://styled-components.com/docs/advanced#theming)。这里有一个例子，展示如何基于属性创建一个<em>文本</em>组件，并且有多种样式变化：

```javascript
import styled from 'styled-components/native';
import { css } from 'styled-components';

const FancyText = styled.Text`
  color: grey;
  font-size: 14px;

  ${({ isBlue }) =>
    isBlue &&
    css`
      color: blue;
    `}

  ${({ isBig }) =>
    isBig &&
    css`
      font-size: 24px;
      font-weight: 700;
    `}
`;

const Main = () => {
  return (
    <>
      <FancyText>Simple text</FancyText>
      <FancyText isBlue>Blue text</FancyText>
      <FancyText isBig>Big text</FancyText>
      <FancyText isBig isBlue>
        Big blue text
      </FancyText>
    </>
  );
};
```

<!-- Because styled-components processes the style definitions, it is possible to use CSS-like snake case syntax with the property names and units in property values. However, units don''t have any effect because property values are internally unitless. For more information on styled-components, head out to the [documentation](https://styled-components.com/docs).-->
因为styled-components处理样式定义，所以可以使用类似CSS的蛇形大小写语法来使用属性名称和属性值中的单位。但是，单位没有任何效果，因为属性值在内部是无单位的。要了解更多关于styled-components的信息，请访问[文档](https://styled-components.com/docs)。

#### React-spring

<!-- > react-spring is a spring-physics based animation library that should cover most of your UI related animation needs. It gives you tools flexible enough to confidently cast your ideas into moving interfaces.-->
> react-spring是一个基于弹簧物理的动画库，可以满足您大多数与UI相关的动画需求。它提供的工具足够灵活，可以自信地将您的想法转化为移动界面。

<!-- [React-spring](https://www.react-spring.io/) is a library that provides a clean [API](https://react-spring.io/basics) for animating React Native components.-->
[React-spring](https://www.react-spring.io/) 是一个为动画 React Native 组件提供清晰 [API](https://react-spring.io/basics) 的库。

#### React Navigation

<!-- > Routing and navigation for your React Native apps-->
> 路由和导航为您的React Native应用

<!-- [React Navigation](https://reactnavigation.org/) is a routing library for React Native. It shares some similarities with the React Router library we have been using during this and earlier parts. However, unlike React Router, React Navigation offers more native features such as native gestures and animations to transition between views.-->
[React Navigation](https://reactnavigation.org/) 是一个 React Native 的路由库。它与我们在本部分及以前的部分中使用的 React Router 库有一些相似之处。但是，与 React Router 不同，React Navigation 提供更多的本机功能，如本机手势和动画来在视图之间进行转换。

### Closing words

<!-- That's it, our application is ready. Good job! We have learned many new concepts during our journey such as setting up our React Native application using Expo, using React Native's core components and adding style to them, communicating with the server, and testing React Native applications. The final piece of the puzzle would be to deploy the application to the Apple App Store and Google Play Store.-->
那就是了，我们的应用程序已经准备就绪。干得好！在我们的旅程中，我们学到了许多新的概念，例如使用Expo设置我们的React Native应用程序，使用React Native的核心组件并为它们添加样式，与服务器进行通信以及测试React Native应用程序。最后一块拼图就是将应用程序部署到Apple App Store和Google Play Store。

<!-- Deploying the application is entirely <i>optional</i> and it isn't quite trivial, because you also need to fork and deploy the [rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api). For the React Native application itself, you first need to create either iOS or Android builds by following Expo's [documentation](https://docs.expo.io/distribution/building-standalone-apps/). Then you can upload these builds to either Apple App Store or Google Play Store. Expo has [documentation](https://docs.expo.io/distribution/uploading-apps/) for this as well.-->
部署应用完全是<i>可选的</i>，而且这并不是很简单的事情，因为你还需要分叉并部署[rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api)。对于React Native应用本身，你首先需要根据Expo的[文档](https://docs.expo.io/distribution/building-standalone-apps/)创建iOS或Android构建。然后你可以将这些构建上传到Apple App Store或Google Play Store。Expo也有[文档](https://docs.expo.io/distribution/uploading-apps/)。

</div>
