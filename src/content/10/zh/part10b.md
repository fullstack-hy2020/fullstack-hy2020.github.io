---
mainImage: ../../../images/part-10.svg
part: 10
letter: b
lang: zh
---

<div class="content">

<!-- Now that we have set up our development environment we can get into React Native basics and get started with the development of our application. In this section, we will learn how to build user interfaces with React Native's core components, how to add style properties to these core components, how to transition between views, and how to manage the form's state efficiently.-->
现在我们已经设置完成开发环境，我们可以开始React Native的基础知识，并开始开发我们的应用程序。在本节中，我们将学习如何使用React Native的核心组件构建用户界面，如何为这些核心组件添加样式属性，如何在视图之间进行转换以及如何有效地管理表单的状态。

### Core components

<!-- In the previous parts, we have learned that we can use React to define components as functions, which receive props as an argument and returns a tree of React elements. This tree is usually represented with JSX syntax. In the browser environment, we have used the [ReactDOM](https://reactjs.org/docs/react-dom.html) library to turn these components into a DOM tree that can be rendered by a browser. Here is a concrete example of a very simple component:-->
在前面的部分中，我们学习到，我们可以使用React将组件定义为函数，该函数接收props作为参数，并返回一棵React元素树。该树通常使用JSX语法表示。在浏览器环境中，我们使用[ReactDOM](https://reactjs.org/docs/react-dom.html)库将这些组件转换为可由浏览器呈现的DOM树。以下是一个非常简单组件的具体示例：

```javascript
const HelloWorld = props => {
  return <div>Hello world!</div>;
};
```

<!-- The <em>HelloWorld</em> component returns a single <i>div</i> element which is created using the JSX syntax. We might remember that this JSX syntax is compiled into <em>React.createElement</em> method calls, such as this:-->
<em>HelloWorld</em> 组件返回一个单独的<i>div</i>元素，它是使用JSX语法创建的。我们可能记得这个JSX语法被编译成<em>React.createElement</em>方法调用，比如这样：

```javascript
React.createElement('div', null, 'Hello world!');
```

<!-- This line of code creates a <i>div</i> element without any props and with a single child element which is a string <i>"Hello world"</i>. When we render this component into a root DOM element using the <em>ReactDOM.render</em> method the <i>div</i> element will be rendered as the corresponding DOM element.-->
这行代码创建一个<i>div</i>元素，没有任何props，只有一个子元素，即字符串<i>"Hello world"</i>。当我们使用<em>ReactDOM.render</em>方法将此组件渲染到根DOM元素时，<i>div</i>元素将被渲染为相应的DOM元素。

<!-- As we can see, React is not bound to a certain environment, such as the browser environment. Instead, there are libraries such as ReactDOM that can render <i>a set of predefined components</i>, such as DOM elements, in a specific environment. In React Native these predefined components are called <i>core components</i>.-->
我们可以看到，React不受某个特定环境（如浏览器环境）的约束。相反，有一些库，如ReactDOM，可以在特定环境中渲染<i>一组预定义组件</i>，比如DOM元素。在React Native中，这些预定义组件被称为<i>核心组件</i>。

<!-- [Core components](https://reactnative.dev/docs/intro-react-native-components) are a set of components provided by React Native, which behind the scenes utilize the platform's native components. Let's implement the previous example using React Native:-->
# 核心组件
React Native提供了一套组件，在幕后利用了平台的本机组件。让我们使用React Native实现前面的示例：

```javascript
import { Text } from 'react-native'; // highlight-line

const HelloWorld = props => {
  return <Text>Hello world!</Text>; // highlight-line
};
```

<!-- So we import the [Text](https://reactnative.dev/docs/text) component from React Native and replace the *div* element with a *Text* element. Many familiar DOM elements have their React Native "counterparts". Here are some examples picked from React Native's [Core Components documentation](https://reactnative.dev/docs/components-and-apis):-->
所以我们从React Native导入[文本](https://reactnative.dev/docs/text)组件，并用*Text*元素替换*div*元素。很多熟悉的DOM元素都有它们的React Native "对应项"。以下是从React Native的[核心组件文档](https://reactnative.dev/docs/components-and-apis)中选取的一些示例：

<!-- - [Text](https://reactnative.dev/docs/text) component is <i>the only</i> React Native component that can have textual children. It is similar to for example the _&lt;strong&gt;_ and the _&lt;h1&gt;_ elements.-->
<i>React Native</i> 组件中，[文本](https://reactnative.dev/docs/text) 组件是唯一可以有文本子元素的组件。它类似于<strong>和<h1>元素。
<!-- - [View](https://reactnative.dev/docs/view) component is the basic user interface building block similar to the _&lt;div&gt;_ element.-->
- [View](https://reactnative.dev/docs/view) 组件是一种基本的用户界面构建块，类似于_&lt;div&gt;_元素。
<!-- - [TextInput](https://reactnative.dev/docs/textinput) component is a text field component similar to the _&lt;input&gt;_ element.-->
[TextInput](https://reactnative.dev/docs/textinput) 组件是一个类似于 _&lt;input&gt;_ 元素的文本字段组件。
<!-- - [Pressable](https://reactnative.dev/docs/pressable) component is for capturing different press events. It is similar to for example the _&lt;button&gt;_ element.-->
- [Pressable](https://reactnative.dev/docs/pressable) 组件用于捕获不同的按钮事件，它与例如 _&lt;button&gt;_ 元素类似。

<!-- There are a few notable differences between core components and DOM elements. The first difference is that the <em>Text</em> component is <i>the only</i> React Native component that can have textual children. This means that you can''t, for example, replace the <em>Text</em> component with the <em>View</em> component in the previous example.-->
有几个显著的不同点在核心组件和DOM元素之间。第一个区别是<em>Text</em>组件是唯一一个可以有文本子元素的React Native组件。这意味着，例如，你不能在前面的例子中用<em>View</em>组件替换<em>Text</em>组件。

<!-- The second notable difference is related to the event handlers. While working with the DOM elements we are used to adding event handlers such as <em>onClick</em> to basically any element such as _&lt;div&gt;_ and _&lt;button&gt;_. In React Native we have to carefully read the [API documentation](https://reactnative.dev/docs/components-and-apis) to know what event handlers (as well as other props) a component accepts. For example, the [Pressable](https://reactnative.dev/docs/pressable) component provides props for listening to different kinds of press events. We can for example use the component's [onPress](https://reactnative.dev/docs/pressable) prop for listening to press events:-->
第二个显著的区别与事件处理器有关。在处理DOM元素时，我们习惯于将事件处理器（如<em>onClick</em>）添加到_&lt;div&gt;_和_&lt;button&gt;_等基本元素上。在React Native中，我们必须仔细阅读[API文档](https://reactnative.dev/docs/components-and-apis)，以了解组件接受哪些事件处理器（以及其他属性）。例如，[Pressable](https://reactnative.dev/docs/pressable)组件提供了侦听不同类型按压事件的属性。我们可以例如使用该组件的[onPress](https://reactnative.dev/docs/pressable)属性来侦听按压事件：

```javascript
import { Text, Pressable, Alert } from 'react-native';

const PressableText = props => {
  return (
    <Pressable
      onPress={() => Alert.alert('You pressed the text!')}
    >
      <Text>You can press me</Text>
    </Pressable>
  );
};
```

<!-- Now that we have a basic understanding of the core components, let's start to give our project some structure. Create a <i>src</i> directory in the root directory of your project and in the <i>src</i> directory create a <i>components</i> directory. In the <i>components</i> directory create a file <i>Main.jsx</i> with the following content:-->
现在我们对核心组件有了基本的了解，让我们开始给项目一些结构。在项目的根目录中创建一个<i>src</i>目录，在<i>src</i>目录中创建一个<i>components</i>目录。在<i>components</i>目录中创建一个名为<i>Main.jsx</i>的文件，内容如下：

```javascript
import Constants from 'expo-constants';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <Text>Rate Repository Application</Text>
    </View>
  );
};

export default Main;
```

<!-- Next, let's use the <em>Main</em> component in the <em>App</em> component in the <i>App.js</i> file which is located in our project's root directory. Replace the current content of the file with this:-->
接下来，让我们在位于项目根目录下的<i>App.js</i>文件中的<em>App</em>组件中使用<em>Main</em>组件。用下面的内容替换文件中当前的内容：

```javascript
import Main from './src/components/Main';

const App = () => {
  return <Main />;
};

export default App;
```

### Manually reloading the application

<!-- As we have seen, Expo will automatically reload the application when we make changes to the code. However, there might be times when automatic reload isn''t working and the application has to be reloaded manually. This can be achieved through the in-app developer menu.-->
如我们所见，当我们对代码进行更改时，Expo将自动重新加载应用程序。 但是，有时自动重新加载可能不起作用，应用程序必须手动重新加载。 这可以通过应用程序内的开发人员菜单实现。

<!-- You can access the developer menu by shaking your device or by selecting "Shake Gesture" inside the Hardware menu in the iOS Simulator. You can also use the <em>⌘D</em> keyboard shortcut when your app is running in the iOS Simulator, or <em>⌘M</em> when running in an Android emulator on Mac OS and <em>Ctrl+M</em> on Windows and Linux.-->
你可以通过摇动设备或在iOS模拟器的硬件菜单中选择“摇动手势”来访问开发者菜单。当你的应用程序在iOS模拟器中运行时，也可以使用<em>⌘D</em>键盘快捷键，或者在Mac OS上运行Android模拟器时使用<em>⌘M</em>，在Windows和Linux上使用<em>Ctrl+M</em>。

<!-- Once the developer menu is open, simply press "Reload" to reload the application. After the application has been reloaded, automatic reloads should work without the need for a manual reload.-->
一旦开发者菜单打开，只需按"重新加载"即可重新加载应用程序。 重新加载应用程序后，无需手动重新加载即可自动重新加载。

</div>

<div class="tasks">

### Exercise 10.3

#### Exercise 10.3: the reviewed repositories list

<!-- In this exercise, we will implement the first version of the reviewed repositories list. The list should contain the repository's full name, description, language, number of forks, number of stars, rating average and number of reviews. Luckily React Native provides a handy component for displaying a list of data, which is the [FlatList](https://reactnative.dev/docs/flatlist) component.-->
在本练习中，我们将实现审查仓库列表的第一个版本。该列表应包含仓库的全名，说明，语言，分叉数，星数，评分平均值和评论数。幸运的是，React Native提供了一个方便的组件来显示数据列表，这就是[FlatList](https://reactnative.dev/docs/flatlist)组件。

<!-- Implement components <em>RepositoryList</em> and <em>RepositoryItem</em> in the <i>components</i> directory's files <i>RepositoryList.jsx</i> and <i>RepositoryItem.jsx</i>. The <em>RepositoryList</em> component should render the <em>FlatList</em> component and <em>RepositoryItem</em> a single item on the list (hint: use the <em>FlatList</em> component's [renderItem](https://reactnative.dev/docs/flatlist#required-renderitem) prop). Use this as the basis for the <i>RepositoryList.jsx</i> file:-->
在`components`目录下的`RepositoryList.jsx`和`RepositoryItem.jsx`文件中实现组件`RepositoryList`和`RepositoryItem`。`RepositoryList`组件应该渲染`FlatList`组件，`RepositoryItem`组件应该渲染列表中的单个项（提示：使用`FlatList`组件的[renderItem](https://reactnative.dev/docs/flatlist#required-renderitem)属性）。以下是`RepositoryList.jsx`文件的基础：

```javascript
import { FlatList, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const repositories = [
  {
    id: 'jaredpalmer.formik',
    fullName: 'jaredpalmer/formik',
    description: 'Build forms in React, without the tears',
    language: 'TypeScript',
    forksCount: 1589,
    stargazersCount: 21553,
    ratingAverage: 88,
    reviewCount: 4,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
  },
  {
    id: 'rails.rails',
    fullName: 'rails/rails',
    description: 'Ruby on Rails',
    language: 'Ruby',
    forksCount: 18349,
    stargazersCount: 45377,
    ratingAverage: 100,
    reviewCount: 2,
    ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/4223?v=4',
  },
  {
    id: 'django.django',
    fullName: 'django/django',
    description: 'The Web framework for perfectionists with deadlines.',
    language: 'Python',
    forksCount: 21015,
    stargazersCount: 48496,
    ratingAverage: 73,
    reviewCount: 5,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/27804?v=4',
  },
  {
    id: 'reduxjs.redux',
    fullName: 'reduxjs/redux',
    description: 'Predictable state container for JavaScript apps',
    language: 'TypeScript',
    forksCount: 13902,
    stargazersCount: 52869,
    ratingAverage: 0,
    reviewCount: 0,
    ownerAvatarUrl: 'https://avatars3.githubusercontent.com/u/13142323?v=4',
  },
];

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = () => {
  return (
    <FlatList
      data={repositories}
      ItemSeparatorComponent={ItemSeparator}
      // other props
    />
  );
};

export default RepositoryList;
```

<i>Do not</i> alter the contents of the <em>repositories</em> variable, it should contain everything you need to complete this exercise. Render the <em>RepositoryList</em> component in the <em>Main</em> component which we previously added to the <i>Main.jsx</i> file. The reviewed repository list should roughly look something like this:

![Application preview](../../images/10/5.jpg)

</div>

<div class="content">

### Style

<!-- Now that we have a basic understanding of how core components work and we can use them to build a simple user interface it is time to add some style. In [part 2](/en/part2/adding_styles_to_react_app) we learned that in the browser environment we can define React component's style properties using CSS. We had the option to either define these styles inline using the <em>style</em> prop or in a CSS file with a suitable selector.-->
现在我们对核心组件的工作原理有了一个基本的了解，我们可以用它们来构建一个简单的用户界面，现在是时候添加一些样式了。在[第二章节](/en/part2/adding_styles_to_react_app)中，我们学习到，在浏览器环境中，我们可以使用CSS来定义React组件的样式属性。我们可以选择使用<em>style</em> prop在内联中定义这些样式，也可以使用带有适当选择器的CSS文件。

<!-- There are many similarities in the way style properties are attached to React Native's core components and the way they are attached to DOM elements. In React Native most of the core components accept a prop called <em>style</em>. The <em>style</em> prop accepts an object with style properties and their values. These style properties are in most cases the same as in CSS, however, property names are in <i>camelCase</i>. This means that CSS properties such as <em>padding-top</em> and <em>font-size</em> are written as <em>paddingTop</em> and <em>fontSize</em>. Here is a simple example of how to use the <em>style</em> prop:-->
在 React Native 的核心组件上附加样式属性的方式，与在 DOM 元素上附加样式属性的方式有许多相似之处。在 React Native 中，大多数核心组件都接受一个名为<em>style</em>的 prop。<em>style</em> prop 接受一个包含样式属性及其值的对象。这些样式属性在大多数情况下与 CSS 相同，但是属性名称为<i>驼峰命名法</i>。这意味着 CSS 属性<em>padding-top</em>和<em>font-size</em>被写为<em>paddingTop</em>和<em>fontSize</em>。以下是如何使用<em>style</em> prop 的简单示例：

```javascript
import { Text, View } from 'react-native';

const BigBlueText = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: 'blue', fontSize: 24, fontWeight: '700' }}>
        Big blue text
      </Text>
    </View>
  );
};
```

<!-- On top of the property names, you might have noticed another difference in the example. In CSS numerical property values commonly have a unit such as <i>px</i>, <i>%</i>, <i>em</i> or <i>rem</i>. In React Native all dimension-related property values such as <em>width</em>, <em>height</em>, <em>padding</em>, and <em>margin</em> as well as font sizes are <i>unitless</i>. These unitless numeric values represent <i>density-independent pixels</i>. In case you are wondering what are the available style properties for certain core components, check the [React Native Styling Cheat Sheet](https://github.com/vhpoet/react-native-styling-cheat-sheet).-->
在属性名称之上，你可能注意到示例中的另一个差异。在CSS中，数值属性值通常具有<i>px</i>、<i>%</i>、<i>em</i>或<i>rem</i>等单位。在React Native中，所有与尺寸相关的属性值，如<em>width</em>、<em>height</em>、<em>padding</em>和<em>margin</em>以及字体大小都是<i>无单位</i>的。这些无单位的数值表示<i>密度无关像素</i>。如果您想知道某些核心组件可用的样式属性，请查看[React Native Styling Cheat Sheet](https://github.com/vhpoet/react-native-styling-cheat-sheet)。

<!-- In general, defining styles directly in the <em>style</em> prop is not considered such a great idea, because it makes components bloated and unclear. Instead, we should define styles outside the component's render function using the [StyleSheet.create](https://reactnative.dev/docs/stylesheet#create) method. The <em>StyleSheet.create</em> method accepts a single argument which is an object consisting of named style objects and it creates a StyleSheet style reference from the given object. Here is an example of how to refactor the previous example using the <em>StyleSheet.create</em> method:-->
一般来说，直接在<em>style</em> prop中定义样式并不是一个好主意，因为它会使组件变得臃肿和模糊不清。相反，我们应该使用[StyleSheet.create](https://reactnative.dev/docs/stylesheet#create)方法在组件的render函数之外定义样式。<em>StyleSheet.create</em>方法接受一个参数，它是一个包含命名样式对象的对象，它可以从给定的对象中创建一个StyleSheet样式引用。下面是一个使用<em>StyleSheet.create</em>方法重构前面示例的示例：

```javascript
import { Text, View, StyleSheet } from 'react-native'; // highlight-line

// highlight-start
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    color: 'blue',
    fontSize: 24,
    fontWeight: '700',
  },
});
// highlight-end

const BigBlueText = () => {
  return (
    <View style={styles.container}> // highlight-line
      <Text style={styles.text}> // highlight-line
        Big blue text
      <Text>
    </View>
  );
};
```

<!-- We create two named style objects, <em>styles.container</em> and <em>styles.text</em>. Inside the component, we can access specific style objects the same way we would access any key in a plain object.-->
我们创建了两个命名的样式对象<em>styles.container</em>和<em>styles.text</em>。在组件中，我们可以像访问普通对象中的任何键一样访问特定的样式对象。

<!-- In addition to an object, the <em>style</em> prop also accepts an array of objects. In the case of an array, the objects are merged from left to right so that latter-style properties take precedence. This works recursively, so we can have for example an array containing an array of styles and so forth. If an array contains values that evaluate to false, such as <em>null</em> or <em>undefined</em>, these values are ignored. This makes it easy to define <i>conditional styles</i> for example, based on the value of a prop. Here is an example of conditional styles:-->
除了一个对象，<em>style</em> prop 也接受一个对象数组。在数组的情况下，对象会从左到右合并，以致于后面的样式属性优先。这会递归地发生，所以我们可以有一个数组包含一个样式数组等等。如果一个数组包含值为假，比如<em>null</em>或<em>undefined</em>，这些值会被忽略。这使得定义<i>条件样式</i>变得容易，比如基于一个prop的值。这里有一个条件样式的例子：

```javascript
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'grey',
    fontSize: 14,
  },
  blueText: {
    color: 'blue',
  },
  bigText: {
    fontSize: 24,
    fontWeight: '700',
  },
});

const FancyText = ({ isBlue, isBig, children }) => {
  const textStyles = [
    styles.text,
    isBlue && styles.blueText,
    isBig && styles.bigText,
  ];

  return <Text style={textStyles}>{children}</Text>;
};

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

<!-- In the example, we use the <em>&&</em> operator with the expression <em>condition && exprIfTrue</em>. This expression yields <em>exprIfTrue</em> if the <em>condition</em> evaluates to true, otherwise it will yield <em>condition</em>, which in that case is a value that evaluates to false. This is an extremely widely used and handy shorthand. Another option would be to use the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) like this:-->
在这个例子中，我们使用`&&`操作符和表达式`condition && exprIfTrue`。如果`condition`求值为真，这个表达式将返回`exprIfTrue`，否则它将返回`condition`，在这种情况下，`condition`是一个求值为假的值。这是一个非常广泛使用且非常方便的简写。另一个选择是使用[条件运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)，如下所示：

```js
condition ? exprIfTrue : exprIfFalse
```

### Consistent user interface with theming

<!-- Let's stick with the concept of styling but with a bit wider perspective. Most of us have used a multitude of different applications and might agree that one trait that makes a good user interface is <i>consistency</i>. This means that the appearance of user interface components such as their font size, font family and color follows a consistent pattern. To achieve this we have to somehow <i>parametrize</i> the values of different style properties. This method is commonly known as <i>theming</i>.-->
让我们继续探讨样式的概念，但从更广阔的视角来看。我们大多数人都使用过许多不同的应用程序，可能都会同意，一个好的用户界面的特征是<i>一致性</i>。这意味着用户界面组件的外观，如字体大小，字体系列和颜色遵循一致的模式。为了实现这一点，我们必须以某种方式<i>参数化</i>不同样式属性的值。这种方法通常称为<i>主题化</i>。

<!-- Users of popular user interface libraries such as [Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/theming/) and [Material UI](https://material-ui.com/customization/theming/) might already be quite familiar with theming. Even though the theming implementations differ, the main idea is always to use variables such as <em>colors.primary</em> instead of ["magic numbers"](<https://en.wikipedia.org/wiki/Magic_number_(programming)>) such as <em>#0366d6</em> when defining styles. This leads to increased consistency and flexibility.-->
用户使用流行的用户界面库，如[Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/theming/)和[Material UI](https://material-ui.com/customization/theming/)可能已经非常熟悉主题了。尽管主题实现不同，但主要思想总是在定义样式时使用变量，如<em>colors.primary</em>，而不是使用["magic numbers"](<https://en.wikipedia.org/wiki/Magic_number_(programming)>)，如<em>#0366d6</em>。这将增加一致性和灵活性。

<!-- Let's see how theming could work in practice in our application. We will be using a lot of text with different variations, such as different font sizes and colors. Because React Native does not support global styles, we should create our own <em>Text</em> component to keep the textual content consistent. Let's get started by adding the following theme configuration object in a <i>theme.js</i> file in the <i>src</i> directory:-->
让我们看看主题在我们的应用程序中如何实际运作。我们将使用具有不同变体的大量文本，例如不同的字体大小和颜色。由于React Native不支持全局样式，我们应该创建自己的<em>Text</em>组件来保持文本内容的一致性。让我们从在<i>src</i>目录中的<i>theme.js</i>文件中添加以下主题配置对象开始：

```javascript
const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: 'System',
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;
```

<!-- Next, we should create the actual <em>Text</em> component which uses this theme configuration. Create a <i>Text.jsx</i> file in the <i>components</i> directory where we already have our other components. Add the following content to the <i>Text.jsx</i> file:-->
接下来，我们应该创建一个实际的<em>文字</em>组件，它使用这个主题配置。在<i>组件</i>目录中创建一个<i>Text.jsx</i>文件，我们已经有其他组件了。将以下内容添加到<i>Text.jsx</i>文件：

```javascript
import { Text as NativeText, StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
```

<!-- Now we have implemented our text component.  This text component has consistent color, font size and font weight variants that we can use anywhere in our application. We can get different text variations using different props like this:-->
现在我们已经实现了我们的文本组件。这个文本组件具有一致的颜色、字体大小和字体重量变体，我们可以在应用程序中的任何地方使用它们。我们可以使用不同的props获得不同的文本变体，就像这样：

```javascript
import Text from './Text';

const Main = () => {
  return (
    <>
      <Text>Simple text</Text>
      <Text style={{ paddingBottom: 10 }}>Text with custom style</Text>
      <Text fontWeight="bold" fontSize="subheading">
        Bold subheading
      </Text>
      <Text color="textSecondary">Text with secondary color</Text>
    </>
  );
};

export default Main;
```

<!-- Feel free to extend or modify this component if you feel like it. It might also be a good idea to create reusable text components such as <em>Subheading</em> which use the <em>Text</em> component. Also, keep on extending and modifying the theme configuration as your application progresses.-->
**请随意扩展或修改这个组件，如果你觉得有必要的话。也可能有一个好主意是创建可重用的文本组件，比如<em>小标题</em>，它使用<em>文本</em>组件。此外，在你的应用程序进展的同时，不断扩展和修改主题配置。

### Using flexbox for layout

<!-- The last concept we will cover related to styling is implementing layouts with [flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox). Those who are more familiar with CSS know that flexbox is not related only to React Native, it has many use cases in web development as well. Those who know how flexbox works in web development won't probably learn that much from this section. Nevertheless, let's learn or revise the basics of flexbox.-->
最后一个与样式有关的概念是使用[flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)实现布局。那些对CSS更熟悉的人知道，flexbox不仅仅与React Native有关，在网页开发中也有很多用途。那些知道flexbox在网页开发中的工作原理的人可能不会从这一部分学到太多。不过，让我们来学习或重新检查flexbox的基础知识吧。

<!-- Flexbox is a layout entity consisting of two separate components: a <i>flex container</i> and inside it a set of <i>flex items</i>. A Flex container has a set of properties that control the flow of its items. To make a component a flex container it must have the style property <em>display</em> set as <em>flex</em> which is the default value for the <em>display</em> property. Here is an example of a flex container:-->
Flexbox 是一个由两个单独组件组成的布局实体：一个<i>flex容器</i>和它内部的一组<i>flex项</i>。Flex容器有一组控制其项目流动的属性。要使一个组件成为flex容器，它必须将样式属性<em>display</em>设置为<em>flex</em>，这是<em>display</em>属性的默认值。这里是一个flex容器的示例：

```javascript
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
  },
});

const FlexboxExample = () => {
  return <View style={styles.flexContainer}>{/* ... */}</View>;
};
```

<!-- Perhaps the most important properties of a flex container are the following:-->
也许最重要的弹性容器属性是以下几点：

<!-- - [flexDirection](https://css-tricks.com/almanac/properties/f/flex-direction/) property controls the direction in which the flex items are laid out within the container. Possible values for this property are <em>row</em>, <em>row-reverse</em>, <em>column</em> (default value) and <em>column-reverse</em>. Flex direction <em>row</em> will lay out the flex items from left to right, whereas <em>column</em> from top to bottom. <em>\*-reverse</em> directions will just reverse the order of the flex items.-->
flexDirection 属性控制 flex 项目在容器中的布局方向。此属性的可能值为 <em>row</em>、<em>row-reverse</em>、<em>column</em>（默认值）以及 <em>column-reverse</em>。Flex direction <em>row</em> 会从左到右布局 flex 项目，而 <em>column</em> 则会从上到下布局。<em>\*-reverse</em> 方向只是反转 flex 项目的顺序。

<!-- - [justifyContent](https://css-tricks.com/almanac/properties/j/justify-content/) property controls the alignment of flex items along the main axis (defined by the <em>flexDirection</em> property). Possible values for this property are <em>flex-start</em> (default value), <em>flex-end</em>, <em>center</em>, <em>space-between</em>, <em>space-around</em> and <em>space-evenly</em>.-->
- [justifyContent](https://css-tricks.com/almanac/properties/j/justify-content/) 属性控制flex项目沿着主轴（由<em>flexDirection</em>属性定义）的对齐方式。此属性的可能值为<em>flex-start</em>（默认值）、<em>flex-end</em>、<em>center</em>、<em>space-between</em>、<em>space-around</em>和<em>space-evenly</em>。
<!-- - [alignItems](https://css-tricks.com/almanac/properties/a/align-items/) property does the same as <em>justifyContent</em> but for the opposite axis. Possible values for this property are <em>flex-start</em>, <em>flex-end</em>, <em>center</em>, <em>baseline</em> and <em>stretch</em> (default value).-->
- [alignItems](https://css-tricks.com/almanac/properties/a/align-items/) 属性与 <em>justifyContent</em> 相同，但是针对相反的轴。该属性可能的值有 <em>flex-start</em>、<em>flex-end</em>、<em>center</em>、<em>baseline</em> 和 <em>stretch</em>（默认值）。

<!-- Let's move on to flex items. As mentioned, a flex container can contain one or many flex items. Flex items have properties that control how they behave in respect of other flex items in the same flex container. To make a component a flex item all you have to do is to set it as an immediate child of a flex container:-->
让我们继续讨论flex项目。正如前面提到的，一个flex容器可以包含一个或多个flex项目。Flex项目具有控制它们如何在同一个flex容器中的其他flex项目中表现的属性。要使一个组件成为flex项目，您所要做的就是将它设置为flex容器的直接子元素：

```javascript
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
  },
  flexItemA: {
    flexGrow: 0,
    backgroundColor: 'green',
  },
  flexItemB: {
    flexGrow: 1,
    backgroundColor: 'blue',
  },
});

const FlexboxExample = () => {
  return (
    <View style={styles.flexContainer}>
      <View style={styles.flexItemA}>
        <Text>Flex item A</Text>
      </View>
      <View style={styles.flexItemB}>
        <Text>Flex item B</Text>
      </View>
    </View>
  );
};
```

<!-- One of the most commonly used properties of flex items is the [flexGrow](https://css-tricks.com/almanac/properties/f/flex-grow/) property. It accepts a unitless value which defines the ability for a flex item to grow if necessary. If all flex items have a <em>flexGrow</em> of <em>1</em>, they will share all the available space evenly. If a flex item has a <em>flexGrow</em> of <em>0</em>, it will only use the space its content requires and leave the rest of the space for other flex items.-->
其中最常用的Flex项目属性是[flexGrow](https://css-tricks.com/almanac/properties/f/flex-grow/)属性。它接受一个无单位的值，用于定义Flex项目是否需要增长。如果所有Flex项目的<em>flexGrow</em>都是<em>1</em>，它们将均匀分享所有可用空间。如果Flex项目的<em>flexGrow</em>是<em>0</em>，它只会使用其内容所需的空间，剩下的空间留给其他Flex项目。

<!-- Here is a more interactive and concrete example of how to use flexbox to implement a simple card component with a header, body and footer: [Flexbox example](https://snack.expo.io/@kalleilv/3d045d).-->
这是一个更加交互式和具体的例子，展示了如何使用Flexbox来实现一个简单的卡片组件，包括头部、主体和底部：[Flexbox示例](https://snack.expo.io/@kalleilv/3d045d)。

<!-- Next, read the article [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) which has comprehensive visual examples of flexbox. It is also a good idea to play around with the flexbox properties in the [Flexbox Playground](https://flexbox.tech/) to see how different flexbox properties affect the layout. Remember that in React Native the property names are the same as the ones in CSS except for the <i>camelCase</i> naming. However, the <i>property values</i> such as <em>flex-start</em> and <em>space-between</em> are exactly the same.-->
接下来，阅读[Flexbox完全指南](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)，它拥有全面的Flexbox视觉示例。同样也可以在[Flexbox Playground](https://flexbox.tech/)中玩耍一下，以了解不同的Flexbox属性如何影响布局。记住，在React Native中，属性名称与CSS中的一样，只是使用了<i>驼峰命名法</i>。然而，<i>属性值</i>，比如<em>flex-start</em>和<em>space-between</em>是完全一样的。

<!-- **NB:** React Native and CSS has some differences regarding the flexbox. The most important difference is that in React Native the default value for the <em>flexDirection</em> property is <em>column</em>. It is also worth noting that the <em>flex</em> shorthand doesn't accept multiple values in React Native. More on React Native's flexbox implementation can be read in the [documentation](https://reactnative.dev/docs/flexbox).-->
**中文：** React Native 和 CSS 在 Flexbox 方面有一些不同。最重要的区别是，在 React Native 中，<em>flexDirection</em> 属性的默认值为<em>column</em>。值得注意的是，React Native 中的 <em>flex</em> 缩写不接受多个值。更多关于 React Native 的 Flexbox 实现的信息可以在[文档](https://reactnative.dev/docs/flexbox)中找到。

</div>

<div class="tasks">

### Exercises 10.4-10.5

#### Exercise 10.4: the app bar

<!-- We will soon need to navigate between different views in our application. That is why we need an [app bar](https://material.io/components/app-bars-top/) to display tabs for switching between different views. Create a file <i>AppBar.jsx</i> in the <i>components</i> folder with the following content:-->
我们很快就需要在我们的应用程序之间导航。这就是为什么我们需要一个[应用程序栏](https://material.io/components/app-bars-top/)来显示切换不同视图的标签。在<i>components</i>文件夹中创建一个文件<i>AppBar.jsx</i>，其内容如下：

```javascript
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    // ...
  },
  // ...
});

const AppBar = () => {
  return <View style={styles.container}>{/* ... */}</View>;
};

export default AppBar;
```

<!-- Now that the <em>AppBar</em> component will prevent the status bar from overlapping the content, you can remove the <em>marginTop</em> style we added for the <em>Main</em> component earlier in the <i>Main.jsx</i> file. The <em>AppBar</em> component should currently contain a tab with the text <em>"Repositories"</em>. Make the tab pressable by using the [Pressable](https://reactnative.dev/docs/pressable) component but you don''t have to handle the <em>onPress</em> event in any way. Add the <em>AppBar</em> component to the <em>Main</em> component so that it is the uppermost component on the screen. The <em>AppBar</em> component should look something like this:-->
现在，<em>AppBar</em> 组件可以防止状态栏重叠内容，您可以在 <i>Main.jsx</i> 文件中移除我们之前为 <em>Main</em> 组件添加的 <em>marginTop</em> 样式。<em>AppBar</em> 组件当前应该包含一个带有文本 <em>"Repositories"</em> 的标签。使用 [Pressable](https://reactnative.dev/docs/pressable) 组件使标签可按，但您不必以任何方式处理 <em>onPress</em> 事件。将 <em>AppBar</em> 组件添加到 <em>Main</em> 组件中，使其成为屏幕上最上层的组件。<em>AppBar</em> 组件应该看起来像这样：

![Application preview](../../images/10/6.jpg)

<!-- The background color of the app bar in the image is <em>#24292e</em> but you can use any other color as well. It might be a good idea to add the app bar's background color into the theme configuration so that it is easy to change it if needed. Another good idea might be to separate the app bar's tab into a component like <em>AppBarTab</em> so that it is easy to add new tabs in the future.-->
图片中的应用栏的背景颜色是<em>#24292e</em>，但你也可以使用其他颜色。将应用栏的背景颜色添加到主题配置中可能是一个好主意，以便在需要时可以轻松更改它。另一个好主意可能是将应用栏的选项卡分成一个组件，如<em>AppBarTab</em>，以便将来可以轻松添加新的选项卡。

#### Exercise 10.5: polished reviewed repositories list

<!-- The current version of the reviewed repositories list looks quite grim. Modify the <i>RepositoryItem</i> component so that it also displays the repository author's avatar image. You can implement this by using the [Image](https://reactnative.dev/docs/image) component. Counts, such as the number of stars and forks, larger than or equal to 1000 should be displayed in thousands with the precision of one decimal and with a "k" suffix. This means that for example fork count of 8439 should be displayed as "8.4k". Also, polish the overall look of the component so that the reviewed repositories list looks something like this:-->
当前审查的存储库列表的版本看起来相当暗淡。修改<i>RepositoryItem</i>组件，使其也显示存储库作者的头像图像。您可以通过使用[Image](https://reactnative.dev/docs/image)组件来实现这一点。大于或等于1000的计数，如星星和叉子的数量，应以小数点后一位和“k”后缀的千位数显示。这意味着例如叉子计数8439应显示为“8.4k”。另外，改善组件的整体外观，使审查的存储库列表看起来像这样：

![Application preview](../../images/10/7.jpg)

<!-- In the image, the <em>Main</em> component's background color is set to <em>#e1e4e8</em> whereas <em>RepositoryItem</em> component's background color is set to <em>white</em>. The language tag's background color is <em>#0366d6</em> which is the value of the <em>colors.primary</em> variable in the theme configuration. Remember to exploit the <em>Text</em> component we implemented earlier. Also when needed, split the <em>RepositoryItem</em> component into smaller components.-->
在图片中，<em>Main</em> 组件的背景颜色设置为 <em>#e1e4e8</em>，而 <em>RepositoryItem</em> 组件的背景颜色设置为白色。语言标签的背景颜色为 <em>#0366d6</em>，这是主题配置中 <em>colors.primary</em> 变量的值。记住要利用我们先前实现的 <em>Text</em> 组件。另外，当需要时，将 <em>RepositoryItem</em> 组件拆分为更小的组件。

</div>

<div class="content">

### Routing

<!-- When we start to expand our application we will need a way to transition between different views such as the repositories view and the sign-in view. In [part 7](/en/part7/react_router) we got familiar with [React router](https://reactrouter.com/) library and learned how to use it to implement routing in a web application.-->
当我们开始扩展我们的应用程序时，我们需要一种方法来在仓库视图和登录视图之间过渡。在[第7章节](/en/part7/react_router)中，我们熟悉了[React router](https://reactrouter.com/)库，并学习了如何使用它在Web应用程序中实现路由。

<!-- Routing in a React Native application is a bit different from routing in a web application. The main difference is that we can't reference pages with URLs, which we type into the browser's address bar, and can't navigate back and forth through the user's history using the browser's [history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API). However, this is just a matter of the router interface we are using.-->
在 React Native 应用中的路由与网页应用的路由有些不同。主要的区别是我们不能通过用户输入浏览器地址栏中的 URL 来引用页面，也不能使用浏览器的[历史 API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)来前后导航。不过，这只是我们使用的路由器界面的问题。

<!-- With React Native we can use the entire React router's core, including the hooks and components. The only difference to the browser environment is that we must replace the <em>BrowserRouter</em> with React Native compatible [NativeRouter](https://reactrouter.com/en/6.4.5/router-components/native-router), provided by the [react-router-native](https://www.npmjs.com/package/react-router-native) library. Let's get started by installing the <i>react-router-native</i> library:-->
使用React Native，我们可以使用整个React路由器的核心，包括钩子和组件。与浏览器环境的唯一区别是，我们必须用由[react-router-native](https://www.npmjs.com/package/react-router-native)库提供的<em>NativeRouter</em>替换<em>BrowserRouter</em>。让我们开始安装<i>react-router-native</i>库：

```shell
npm install react-router-native
```

<!-- Next, open the <i>App.js</i> file and add the <em>NativeRouter</em> component to the <em>App</em> component:-->
接下来，打开<i>App.js</i>文件，并将<em>NativeRouter</em>组件添加到<em>App</em>组件中：

```javascript
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native'; // highlight-line

import Main from './src/components/Main';

const App = () => {
  return (
    // highlight-start
    <>
      <NativeRouter>
        <Main />
      </NativeRouter>
      <StatusBar style="auto" />
    </>
    // highlight-end
  );
};

export default App;
```

<!-- Once the router is in place, let's add our first route to the <me>Main</em> component in the <i>Main.jsx</i> file:-->
一旦路由器就位，让我们在<i>Main.jsx</i>文件中向<em>Main</em>组件添加我们的第一条路由：

```javascript
import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native'; // highlight-line

import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      // highlight-start
      <Routes>
        <Route path="/" element={<RepositoryList />} exact />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      // highlight-end
    </View>
  );
};

export default Main;
```

<!-- That's it! The last <em>Route</em> inside the <em>Routes</em> is for catching paths that don't match any previously defined path. In this case, we want to navigate to the home view.-->
那就是它了！`Routes`中的最后一个<em>路由</em>是用于捕获不匹配任何先前定义路径的路径。在这种情况下，我们想导航到主页视图。

</div>

<div class="tasks">

### Exercises 10.6-10.7

#### Exercise 10.6: the sign-in view

<!-- We will soon implement a form, that a user can use to <i>sign in</i> to our application. Before that, we must implement a view that can be accessed from the app bar. Create a file <i>SignIn.jsx</i> in the <i>components</i> directory with the following content:-->
我们将很快实施一个表单，用户可以使用它<i>登录</i>我们的应用程序。在此之前，我们必须实施一个可以从应用栏访问的视图。在<i>components</i>目录下创建一个<i>SignIn.jsx</i>文件，内容如下：

```javascript
import Text from './Text';

const SignIn = () => {
  return <Text>The sign-in view</Text>;
};

export default SignIn;
```

<!-- Set up a route for this <em>SignIn</em> component in the <em>Main</em> component. Also, add a tab with the text "Sign in" to the app bar next to the "Repositories" tab. Users should be able to navigate between the two views by pressing the tabs (hint: you can use the React router's [Link](https://reactrouter.com/en/6.4.5/components/link-native) component).-->
在主组件中为这个<em>SignIn</em>组件设置一条路由。另外，在应用栏旁边的“仓库”标签旁添加一个带有“登录”文本的标签。用户应该能够通过按标签（提示：您可以使用React router的[Link](https://reactrouter.com/en/6.4.5/components/link-native)组件）在两个视图之间导航。

#### Exercise 10.7: scrollable app bar

<!-- As we are adding more tabs to our app bar, it is a good idea to allow horizontal scrolling once the tabs won''t fit the screen. The [ScrollView](https://reactnative.dev/docs/scrollview) component is just the right component for the job.-->
随着我们向应用栏添加更多选项卡，一旦选项卡不能适应屏幕，允许水平滚动是个好主意。[ScrollView](https://reactnative.dev/docs/scrollview)组件正是这项工作的合适组件。

<!-- Wrap the tabs in the <em>AppBar</em> component's tabs with a <em>ScrollView</em> component:-->
在<em>AppBar</em>组件的标签中包装一个<em>ScrollView</em>组件：

```javascript
const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>{/* ... */}</ScrollView> // highlight-line
    </View>
  );
};
```

<!-- Setting the [horizontal](https://reactnative.dev/docs/scrollview#horizontal) prop <em>true</em> will cause the <em>ScrollView</em> component to scroll horizontally once the content won't fit the screen. Note that, you will need to add suitable style properties to the <em>ScrollView</em> component so that the tabs will be laid in a <i>row</i> inside the flex container. You can make sure that the app bar can be scrolled horizontally by adding tabs until the last tab won't fit the screen. Just remember to remove the extra tabs once the app bar is working as intended.-->
设置[水平]（https://reactnative.dev/docs/scrollview#horizontal）prop <em>true</em>会导致<em>ScrollView</em>组件在内容不适合屏幕时水平滚动。请注意，您需要为<em>ScrollView</em>组件添加适当的样式属性，以便将标签放在flex容器中的一行中。您可以通过添加标签来确保应用栏可以水平滚动，直到最后一个标签不适合屏幕为止。只要记住，一旦应用栏按预期工作，就可以删除额外的标签。

</div>

<div class="content">

### Form state management

<!-- Now that we have a placeholder for the sign-in view the next step would be to implement the sign-in form. Before we get to that let's talk about forms from a wider perspective.-->
现在我们已经有了登录视图的占位符，接下来的步骤就是实现登录表单。在我们开始之前，让我们从更广泛的视角来谈谈表单。

<!-- Implementation of forms relies heavily on state management. Using React's <em>useState</em> hook for state management might get the job done for smaller forms. However, it will quickly make state management for more complex forms quite tedious. Luckily there are many good libraries in the React ecosystem that ease the state management of forms. One of these libraries is [Formik](https://formik.org/).-->
实施表单依赖于状态管理。使用React的<em>useState</em>钩子进行状态管理可以完成较小表单的工作。但是，对于更复杂的表单，这将很快使状态管理变得非常繁琐。幸运的是，React生态系统中有许多很好的库可以简化表单的状态管理。其中一个库是[Formik](https://formik.org/)。

<!-- The main concepts of Formik are the <i>context</i> and the <i>field</i>. The Formik's context is provided by the [Formik](https://formik.org/docs/api/formik) component that contains the form's state. The state consists of information on a form's fields. This information includes for example the value and validation errors of each field. State's fields can be referenced by their name using the [useField](https://formik.org/docs/api/useField) hook or the [Field](https://formik.org/docs/api/field) component.-->
Formik的主要概念是<i>上下文</i>和<i>字段</i>。Formik的上下文由[Formik](https://formik.org/docs/api/formik)组件提供，该组件包含表单的状态。该状态包括表单字段的信息。该信息包括每个字段的值和验证错误。可以使用[useField](https://formik.org/docs/api/useField)钩子或[Field](https://formik.org/docs/api/field)组件引用状态字段的名称。

<!-- Let's see how this works by creating a form for calculating the [body mass index](https://en.wikipedia.org/wiki/Body_mass_index):-->
让我们通过创建一个计算[身体质量指数](https://en.wikipedia.org/wiki/Body_mass_index)的表格来看看这个怎么运作：

```javascript
import { Text, TextInput, Pressable, View } from 'react-native';
import { Formik, useField } from 'formik';

const initialValues = {
  mass: '',
  height: '',
};

const getBodyMassIndex = (mass, height) => {
  return Math.round(mass / Math.pow(height, 2));
};

const BodyMassIndexForm = ({ onSubmit }) => {
  const [massField, massMeta, massHelpers] = useField('mass');
  const [heightField, heightMeta, heightHelpers] = useField('height');

  return (
    <View>
      <TextInput
        placeholder="Weight (kg)"
        value={massField.value}
        onChangeText={text => massHelpers.setValue(text)}
      />
      <TextInput
        placeholder="Height (m)"
        value={heightField.value}
        onChangeText={text => heightHelpers.setValue(text)}
      />
      <Pressable onPress={onSubmit}>
        <Text>Calculate</Text>
      </Pressable>
    </View>
  );
};

const BodyMassIndexCalculator = () => {
  const onSubmit = values => {
    const mass = parseFloat(values.mass);
    const height = parseFloat(values.height);

    if (!isNaN(mass) && !isNaN(height) && height !== 0) {
      console.log(`Your body mass index is: ${getBodyMassIndex(mass, height)}`);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit }) => <BodyMassIndexForm onSubmit={handleSubmit} />}
    </Formik>
  );
};
```

<!-- This example is not part of our application, so you don''t need to add this code to the application. You can however try it out for example in [Expo Snack](https://snack.expo.io/). Expo Snack is an online editor for React Native, similar to [JSFiddle](https://jsfiddle.net/) and [CodePen](https://codepen.io/). It is a useful platform for quickly trying out code. You can share Expo Snacks with others using a link or embedding them as a <i>Snack Player</i> on a website. You might have bumped into Snack Players for example in this material and React Native documentation.-->
这个示例不是我们应用程序的一部分，因此您不需要将此代码添加到应用程序中。但是，您可以尝试在[Expo Snack](https://snack.expo.io/)中尝试它。 Expo Snack是一个React Native的在线编辑器，类似于[JSFiddle](https://jsfiddle.net/)和[CodePen](https://codepen.io/)。它是一个有用的平台，可以快速尝试代码。您可以使用链接或将它们嵌入到网站上的<i>Snack Player</i>中与他人共享Expo Snacks。您可能在此材料和React Native文档中遇到过Snack Players。

<!-- In the example, we define the <em>Formik</em> context in the <em>BodyMassIndexCalculator</em> component and provide it with initial values and a submit callback. Initial values are provided through the [initialValues](https://formik.org/docs/api/formik#initialvalues-values) prop as an object with field names as keys and the corresponding initial values as values. The submit callback is provided through the [onSubmit](https://formik.org/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany) prop and it is called when the <em>handleSubmit</em> function is called, with the condition that there aren''t any validation errors. <em>children</em> of the <em>Formik</em> component is a function that is called with [props](https://formik.org/docs/api/formik#formik-render-methods-and-props) including state-related information and actions such as the <em>handleSubmit</em> function.-->
在这个例子中，我们在`BodyMassIndexCalculator`组件中定义`Formik`上下文，并提供初始值和提交回调函数。初始值通过`initialValues`属性提供，它是一个对象，其中键是字段名，值是相应的初始值。提交回调函数通过`onSubmit`属性提供，当调用`handleSubmit`函数时，它将被调用，前提是没有任何验证错误。`Formik`组件的`children`是一个函数，它使用包括状态相关信息和操作（例如`handleSubmit`函数）在内的`props`调用。

<!-- The <em>BodyMassIndexForm</em> component contains the state bindings between the context and text inputs. We use the [useField](https://formik.org/docs/api/useField) hook to get the value of a field and to change it. <em>useField</em> hooks have one argument which is the name of the field and it returns an array with three values, <em>[field, meta, helpers]</em>. The [field object](https://formik.org/docs/api/useField#fieldinputpropsvalue) contains the value of the field, the [meta object](https://formik.org/docs/api/useField#fieldmetapropsvalue) contains field meta information such as a possible error message and the [helpers object](https://formik.org/docs/api/useField#fieldhelperprops) contains different actions for changing the state of the field such as the <em>setValue</em> function. Note that the component that uses the <em>useField</em> hook has to be <i>within Formik's context</i>. This means that the component has to be a descendant of the <em>Formik</em> component.-->
<em>BodyMassIndexForm</em> 组件包含上下文和文本输入之间的状态绑定。我们使用 [useField](https://formik.org/docs/api/useField) 钩子来获取字段的值并进行更改。<em>useField</em> 钩子有一个参数，即字段的名称，它返回一个包含三个值的数组 <em>[field, meta, helpers]</em>。[field 对象](https://formik.org/docs/api/useField#fieldinputpropsvalue) 包含字段的值，[meta 对象](https://formik.org/docs/api/useField#fieldmetapropsvalue) 包含字段元信息，例如可能的错误消息，以及[helpers 对象](https://formik.org/docs/api/useField#fieldhelperprops) 包含更改字段状态的不同操作，例如 <em>setValue</em> 函数。请注意，使用 <em>useField</em> 钩子的组件必须<i>处于 Formik 的上下文中</i>。这意味着该组件必须是 <em>Formik</em> 组件的后代。

<!-- Here is an interactive version of our previous example: [Formik example](https://snack.expo.io/@kalleilv/formik-example).-->
这里有一个我们之前例子的交互版本：[Formik 示例](https://snack.expo.io/@kalleilv/formik-example)。

<!-- In the previous example using the <em>useField</em> hook with the <em>TextInput</em> component causes repetitive code. Let's extract this repetitive code into a <em>FormikTextInput</em> component and create a custom <em>TextInput</em> component to make text inputs a bit more visually pleasing. First, let's install Formik:-->
在前面的例子中，使用<em>useField</em>钩子和<em>TextInput</em>组件会导致重复代码。让我们把这个重复代码提取到一个<em>FormikTextInput</em>组件中，并创建一个自定义的<em>TextInput</em>组件，使文本输入更具可视化。首先，让我们安装Formik：

```shell
npm install formik
```

<!-- Next, create a file <i>TextInput.jsx</i> in the <i>components</i> directory with the following content:-->
下一步，在<i>components</i>目录下创建一个文件<i>TextInput.jsx</i>，内容如下：

```javascript
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [style];

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
```

<!-- Let's move on to the <em>FormikTextInput</em> component that adds Formik's state bindings to the <em>TextInput</em> component. Create a file <i>FormikTextInput.jsx</i> in the <i>components</i> directory with the following content:-->
让我们继续讨论在<em>TextInput</em>组件中添加Formik状态绑定的<em>FormikTextInput</em>组件。在<i>components</i>目录中创建一个名为<i>FormikTextInput.jsx</i>的文件，内容如下：

```javascript
import { StyleSheet } from 'react-native';
import { useField } from 'formik';

import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    marginTop: 5,
  },
});

const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <>
      <TextInput
        onChangeText={value => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </>
  );
};

export default FormikTextInput;
```

<!-- By using the <em>FormikTextInput</em> component we could refactor the <em>BodyMassIndexForm</em> component in the previous example like this:-->
使用<em>FormikTextInput</em>组件，我们可以像这样重构前面例子中的<em>BodyMassIndexForm</em>组件：

```javascript
const BodyMassIndexForm = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput name="mass" placeholder="Weight (kg)" /> // highlight-line
      <FormikTextInput name="height" placeholder="Height (m)" /> //highlight-line
      <Pressable onPress={onSubmit}>
        <Text>Calculate</Text>
      </Pressable>
    </View>
  );
};
```

<!-- As we can see, implementing the <em>FormikTextInput</em> component that handles the <em>TextInput</em> component's Formik bindings saves a lot of code. If your Formik forms use other input components, it is a good idea to implement similar abstractions for them as well.-->
正如我们所看到的，实施处理<em>TextInput</em>组件的<em>FormikTextInput</em>组件可以节省很多代码。如果您的Formik表单使用其他输入组件，最好也为它们实现类似的抽象。

</div>

<div class="tasks">

### Exercise 10.8

#### Exercise 10.8: the sign-in form

<!-- Implement a sign-in form to the <em>SignIn</em> component we added earlier in the <i>SignIn.jsx</i> file. The sign-in form should include two text fields, one for the username and one for the password. There should also be a button for submitting the form. You don''t need to implement an <em>onSubmit</em> callback function, it is enough that the form values are logged using <em>console.log</em> when the form is submitted:-->
在我们之前在`SignIn.jsx`文件中添加的`SignIn`组件中实现一个登录表单。登录表单应该包含两个文本字段，一个用于用户名，一个用于密码。还应该有一个提交表单的按钮。你不需要实现`onSubmit`回调函数，只要在提交表单时使用`console.log`记录表单值就行了。

```javascript
const onSubmit = (values) => {
  console.log(values);
};
```

<!-- Remember to utilize the <em>FormikTextInput</em> component we implemented earlier. You can use the [secureTextEntry](https://reactnative.dev/docs/textinput#securetextentry) prop in the <em>TextInput</em> component to obscure the password input.-->
记住要使用我们之前实现的<em>FormikTextInput</em>组件。您可以在<em>TextInput</em>组件中使用[secureTextEntry](https://reactnative.dev/docs/textinput#securetextentry) prop来隐藏密码输入。

<!-- The sign-in form should look something like this:-->
登录表单应该看起来像这样：

![Application preview](../../images/10/19.jpg)

</div>

<div class="content">

### Form validation

<!-- Formik offers two approaches to form validation: a validation function or a validation schema. A validation function is a function provided for the <em>Formik</em> component as the value of the [validate](https://formik.org/docs/guides/validation#validate) prop. It receives the form's values as an argument and returns an object containing possible field-specific error messages.-->
Formik 提供了两种表单验证方法：验证函数或验证模式。验证函数是作为<em>Formik</em>组件的[validate](https://formik.org/docs/guides/validation#validate)属性的值提供的函数。它接收表单的值作为参数，并返回一个包含可能存在的特定字段错误消息的对象。

<!-- The second approach is the validation schema which is provided for the <em>Formik</em> component as the value of the [validationSchema](https://formik.org/docs/guides/validation#validationschema) prop. This validation schema can be created with a validation library called [Yup](https://github.com/jquense/yup). Let's get started by installing Yup:-->
第二种方法是验证模式，它作为[validationSchema](https://formik.org/docs/guides/validation#validationschema) prop的值提供给<em>Formik</em>组件。 这个验证模式可以使用一个叫做[Yup](https://github.com/jquense/yup)的验证库来创建。 让我们开始安装Yup：

```shell
npm install yup
```

<!-- Next, as an example, let's create a validation schema for the body mass index form we implemented earlier. We want to validate that both <em>mass</em> and <em>height</em> fields are present and they are numeric. Also, the value of <em>mass</em> should be greater or equal to 1 and the value of <em>height</em> should be greater or equal to 0.5. Here is how we define the schema:-->
接下来，以我们之前实现的身体质量指数表格为例，来创建一个验证模式。我们希望验证<em>质量</em>和<em>身高</em>字段是否存在，以及它们是否为数字。此外，<em>质量</em>的值应该大于或等于1，<em>身高</em>的值应该大于或等于0.5。以下是我们定义模式的方式：

```javascript
import * as yup from 'yup'; // highlight-line

// ...

// highlight-start
const validationSchema = yup.object().shape({
  mass: yup
    .number()
    .min(1, 'Weight must be greater or equal to 1')
    .required('Weight is required'),
  height: yup
    .number()
    .min(0.5, 'Height must be greater or equal to 0.5')
    .required('Height is required'),
});
// highlight-end

const BodyMassIndexCalculator = () => {
  // ...

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema} // highlight-line
    >
      {({ handleSubmit }) => <BodyMassIndexForm onSubmit={handleSubmit} />}
    </Formik>
  );
};
```

<!-- The validation is performed by default every time a field's value changes and when the <em>handleSubmit</em> function is called. If the validation fails, the function provided for the <em>onSubmit</em> prop of the <em>Formik</em> component is not called.-->
默认情况下，每当字段的值发生变化时，以及调用<em>handleSubmit</em>函数时，都会执行验证。如果验证失败，则不会调用<em>Formik</em>组件的<em>onSubmit</em> prop提供的函数。

<!-- The <em>FormikTextInput</em> component we previously implemented displays field's error message if it is present and the field is "touched", meaning that the field has received and lost focus:-->
<em>FormikTextInput</em> 组件我们之前实现的，如果有错误信息且字段已被"touched"，也就是说字段已经接收并失去焦点，则会显示字段的错误信息：

```javascript
const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);

  // Check if the field is touched and the error message is present
  const showError = meta.touched && meta.error;

  return (
    <>
      <TextInput
        onChangeText={(value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {/* Show the error message if the value of showError variable is true  */}
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </>
  );
};
```

</div>

<div class="tasks">

### Exercise 10.9

#### Exercise 10.9: validating the sign-in form

<!-- Validate the sign-in form so that both username and password fields are required. Note that the <em>onSubmit</em> callback implemented in the previous exercise, <i>should not be called</i> if the form validation fails.-->
验证登录表单，以便要求用户名和密码字段都是必需的。请注意，<em>onSubmit</em>回调函数在之前的练习中实现，<i>如果表单验证失败，则不应调用</i>。

<!-- The current implementation of the <em>FormikTextInput</em> component should display an error message if a touched field has an error. Emphasize this error message by giving it a red color.-->
当前<em>FormikTextInput</em>组件的实现应该在被触摸的字段出现错误时显示一条错误消息。通过将错误消息的颜色设置为红色来强调这条错误消息。

<!-- On top of the red error message, give an invalid field a visual indication of an error by giving it a red border color. Remember that if a field has an error, the <em>FormikTextInput</em> component sets the <em>TextInput</em> component's <em>error</em> prop as <em>true</em>. You can use the value of the <em>error</em> prop to attach conditional styles to the <em>TextInput</em> component.-->
在红色错误讯息之上，给无效栏位一个红色边框的视觉指示，以指示错误。请记住，如果栏位有错误，<em>FormikTextInput</em>元件将<em>TextInput</em>元件的<em>error</em> prop设置为<em>true</em>。您可以使用<em>error</em> prop的值将条件样式附加到<em>TextInput</em>元件。

<!-- Here's what the sign-in form should roughly look like with an invalid field:-->
这就是登录表单应该大致看起来的样子，有一个无效字段： 

| 用户名 | 密码 |
| ------ | ------ |
|  |  |
| **无效字段** |  |

![Application preview](../../images/10/8.jpg)

<!-- The red color used in this implementation is <em>#d73a4a</em>.-->
<em>#d73a4a</em> 这里使用的红色

</div>

<div class="content">

### Platform-specific code

<!-- A big benefit of React Native is that we don''t need to worry about whether the application is run on an Android or iOS device. However, there might be cases where we need to execute <i>platform-specific code</i>. Such cases could be for example using a different implementation of a component on a different platform.-->
React Native 的一个大好处是我们不用担心应用程序是在 Android 还是 iOS 设备上运行。但是，也可能会出现需要执行<i>特定平台的代码</i>的情况。这种情况可能是，例如，在不同的平台上使用不同的组件实现。

<!-- We can access the user's platform through the <em>Platform.OS</em> constant:-->
我们可以通过<em>Platform.OS</em> 常量访问用户的平台：

```javascript
import { React } from 'react';
import { Platform, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: Platform.OS === 'android' ? 'green' : 'blue',
  },
});

const WhatIsMyPlatform = () => {
  return <Text style={styles.text}>Your platform is: {Platform.OS}</Text>;
};
```

<!-- Possible values for the <em>Platform.OS</em> constants are <em>android</em> and <em>ios</em>. Another useful way to define platform-specific code branches is to use the <em>Platform.select</em> method. Given an object where keys are one of <em>ios</em>, <em>android</em>, <em>native</em> and <em>default</em>, the <em>Platform.select</em> method returns the most fitting value for the platform the user is currently running on. We can rewrite the <em>styles</em> variable in the previous example using the <em>Platform.select</em> method like this:-->
可能的值为<em>Platform.OS</em>常量是<em>android</em>和<em>ios</em>。另一种有用的定义特定平台代码分支的方法是使用<em>Platform.select</em>方法。给定一个对象，其键为<em>ios</em>、<em>android</em>、<em>native</em>和<em>default</em>之一，<em>Platform.select</em>方法会返回用户当前正在运行的平台最合适的值。我们可以使用<em>Platform.select</em>方法重写前面示例中的<em>styles</em>变量，如下所示：

```javascript
const styles = StyleSheet.create({
  text: {
    color: Platform.select({
      android: 'green',
      ios: 'blue',
      default: 'black',
    }),
  },
});
```

<!-- We can even use the <em>Platform.select</em> method to require a platform-specific component:-->
我们甚至可以使用<em>Platform.select</em>方法来要求特定平台的组件：

```javascript
const MyComponent = Platform.select({
  ios: () => require('./MyIOSComponent'),
  android: () => require('./MyAndroidComponent'),
})();

<MyComponent />;
```

<!-- However, a more sophisticated method for implementing and importing platform-specific components (or any other piece of code) is to use the <i>.ios.jsx</i> and <i>.android.jsx</i> file extensions. Note that the <i>.jsx</i> extension can as well be any extension recognized by the bundler, such as <i>.js</i>. We can for example have files <i>Button.ios.jsx</i> and <i>Button.android.jsx</i> which we can import like this:-->
然而，一种更复杂的实现和导入平台特定组件（或任何其他代码）的方法是使用<i>.ios.jsx</i>和<i>.android.jsx</i>文件扩展名。请注意，<i>.jsx</i>扩展名也可以是打包器识别的任何扩展名，例如<i>.js</i>。例如，我们可以有文件<i>Button.ios.jsx</i>和<i>Button.android.jsx</i>，我们可以像这样导入它们：

```javascript
import Button from './Button';

const PlatformSpecificButton = () => {
  return <Button />;
};
```

<!-- Now, the Android bundle of the application will have the component defined in the <i>Button.android.jsx</i> whereas the iOS bundle the one defined in the <i>Button.ios.jsx</i> file.-->
现在，应用程序的Android包将具有<i>Button.android.jsx</i>中定义的组件，而iOS包将具有<i>Button.ios.jsx</i>文件中定义的组件。

</div>

<div class="tasks">

### Exercise 10.10

#### Exercise 10.10: a platform-specific font

<!-- Currently, the font family of our application is set to <i>System</i> in the theme configuration located in the <i>theme.js</i> file. Instead of the <i>System</i> font, use a platform-specific [Sans-serif](https://en.wikipedia.org/wiki/Sans-serif) font. On the Android platform, use the <i>Roboto</i> font and on the iOS platform, use the <i>Arial</i> font. The default font can be <i>System</i>.-->
目前，我们应用程序的字体族在主题配置中设置为<i>System</i>，位于<i>theme.js</i>文件中。使用平台特定的[无衬线](https://en.wikipedia.org/wiki/Sans-serif)字体而不是<i>System</i>字体。在安卓平台上使用<i>Roboto</i>字体，在iOS平台上使用<i>Arial</i>字体。默认字体可以是<i>System</i>。

<!-- This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Note that exercises in this section should be submitted to the section named part 2 in the exercise submission system.-->
这是本节的最后一个练习。是时候把你的代码推送到GitHub，并将所有完成的练习提交到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020)。请注意，本节的练习应提交到练习提交系统中名为第2章节的部分。
</div>
