---
mainImage: ../../../images/part-10.svg
part: 10
letter: b
lang: zh
---

<div class="content">

<!-- Now that we have set up our development environment we can get into React Native basics and get started with the development of our application. In this section, we will learn how to build user interfaces with React Native's core components, how to add style properties to these core components, how to transition between views, and how to manage form's state efficiently.-->
 现在我们已经建立了我们的开发环境，我们可以进入React Native基础知识并开始开发我们的应用。在这一节中，我们将学习如何用React Native的核心组件构建用户界面，如何为这些核心组件添加样式属性，如何在视图之间转换，以及如何有效地管理表单的状态。

### Core components

<!-- In the previous parts, we have learned that we can use React to define components as functions which receive props as an argument and returns a tree of React elements. This tree is usually represented with JSX syntax. In the browser environment, we have used the [ReactDOM](https://reactjs.org/docs/react-dom.html) library to turn these components into a DOM tree that can be rendered by a browser. Here is a concrete example of a very simple component:-->
 在前面的部分中，我们已经了解到我们可以使用React将组件定义为接收props作为参数并返回React元素树的函数。这个树通常用JSX语法表示。在浏览器环境中，我们使用了[ReactDOM](https://reactjs.org/docs/react-dom.html)库，将这些组件变成可以被浏览器渲染的DOM树。下面是一个非常简单的组件的具体例子。

```javascript
const HelloWorld = props => {
  return <div>Hello world!</div>;
};
```

<!-- The <em>HelloWorld</em> component returns a single <i>div</i> element which is created using the JSX syntax. We might remember that this JSX syntax is compiled into <em>React.createElement</em> method calls, such as this:-->
 <em>HelloWorld</em>组件返回一个单一的<i>div</i>元素，它是用JJSX语法创建的。我们可能记得，这种JJSX语法被编译成<em>React.createElement</em>方法调用，例如这样。

```javascript
React.createElement('div', null, 'Hello world!');
```

<!-- This line of code creates a <i>div</i> element without any props and with a single child element which is a string <i>"Hello world"</i>. When we render this component into a root DOM element using the <em>ReactDOM.render</em> method the <i>div</i> element will be rendered as the corresponding DOM element.-->
 这行代码创建了一个<i>div</i>元素，没有任何prop，只有一个子元素，是一个字符串<i>"Hello world"</i>。当我们使用<em>ReactDOM.render</em>方法将这个组件渲染成一个根DOM元素时，<i>div</i>元素将被渲染成相应的DOM元素。

<!-- As we can see, React is not bound to a certain environment, such as the browser environment. Instead, there are libraries such as ReactDOM that can render <i>a set of predefined components</i>, such as DOM elements, in a specific environment. In React Native these predefined components are called <i>core components</i>.-->
 正如我们所看到的，React并不拘泥于某种环境，例如浏览器环境。相反，有一些库，如ReactDOM，可以在特定的环境中渲染<i>一组预定义组件</i>，如DOM元素。在React Native中，这些预定义的组件被称为<i>核心组件</i>。

<!-- [Core components](https://reactnative.dev/docs/intro-react-native-components) are a set of components provided by React Native which behind the scenes utilize the platform's native components. Let's implement the previous example using React Native:-->
 [核心组件](https://reactnative.dev/docs/intro-react-native-components)是由React Native提供的一组组件，在幕后利用平台的本地组件。让我们用React Native来实现前面的例子。

```javascript
import { Text } from 'react-native'; // highlight-line

const HelloWorld = props => {
  return <Text>Hello world!</Text>; // highlight-line
};
```

<!-- So we import the [Text](https://reactnative.dev/docs/text) component from React Native and replace the <i>div</i> element with a <i>Text</i> element. Many familiar DOM elements have their React Native "counterparts". Here are some examples picked from the React Native's [Core Components documentation](https://reactnative.dev/docs/components-and-apis):-->
 所以我们从React Native导入[Text](https://reactnative.dev/docs/text)组件，用一个<i>Text</i>元素替换<i>div</i>元素。许多熟悉的DOM元素都有其React Native的 "对应物"。下面是一些从React Native's [Core Components documentation](https://reactnative.dev/docs/components-and-apis)中挑选的例子。

<!-- - [Text](https://reactnative.dev/docs/text) component is <i>the only</i> React Native component that can have textual children. It is similar to for example the <em>&lt;strong&gt;</em> and the <em>&lt;h1&gt;</em> elements.-->
 - [Text](https://reactnative.dev/docs/text) 组件是<i>唯一的</i>React Native组件，可以有文本的孩子。它类似于例如<em>&lt;strong&gt;<em>和<em>&lt;h1&gt;<em>元素。
<!-- - [View](https://reactnative.dev/docs/view) component is the basic user interface building block similar to the <em>&lt;div&gt;</em> element.-->
 - [View](https://reactnative.dev/docs/view)组件是基本的用户界面构建块，类似于<em>&lt;div&gt;</em>元素。
<!-- - [TextInput](https://reactnative.dev/docs/textinput) component is a text field component similar to the <em>&lt;input&gt;</em> element.-->
 - [TextInput](https://reactnative.dev/docs/textinput)组件是一个类似于<em>&lt;input&gt;<em>元素的文本字段组件。
<!-- - [Pressable](https://reactnative.dev/docs/pressable) component is for capturing different press events. It is similar to for example the <em>&lt;button&gt;</em> element.-->
 - [Pressable](https://reactnative.dev/docs/pressable)组件是用来捕捉不同的按压事件。它类似于例如<em>&lt;button&gt;<em>元素。

<!-- There are a few notable differences between core components and DOM elements. The first difference is that the <em>Text</em> component is <i>the only</i> React Native component that can have textual children. This means that you can't, for example, replace the <em>Text</em> component with the <em>View</em> component in the previous example.-->
 核心组件和DOM元素之间有几个明显的区别。第一个区别是，<em>Text</em>组件是<i>唯一的</i>React Native组件，可以有文本的孩子。这意味着你不能，例如，用前面的例子中的<em>Text</em>组件替换<em>View</em>组件。

<!-- The second notable difference is related to the event handlers. While working with the DOM elements we are used to adding event handlers such as <em>onClick</em> to basically any element such as <em>&lt;div&gt;</em> and <em>&lt;button&gt;</em>. In React Native we have to carefully read the [API documentation](https://reactnative.dev/docs/components-and-apis) to know what event handlers (as well as other props) a component accepts. For example, the [Pressable](https://reactnative.dev/docs/pressable) component provides props for listening to different kind of press events. We can for example use the component's [onPress](https://reactnative.dev/docs/pressable) prop for listening to press events:-->
 第二个明显的区别是与事件处理程序有关。当使用DOM元素时，我们习惯于添加事件处理程序，如<em>onClick</em>到基本上任何元素，如<em>&lt;div&gt;</em>和<em>&lt;button&gt;</em>。在React Native中，我们必须仔细阅读[API文档](https://reactnative.dev/docs/components-and-apis)以了解一个组件接受哪些事件处理程序（以及其他prop）。例如，[Pressable](https://reactnative.dev/docs/pressable)组件提供了用于监听不同类型的按压事件的prop。例如，我们可以使用该组件的[onPress](https://reactnative.dev/docs/pressable)prop来监听新闻事件。

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
 现在我们对核心组件有了基本的了解，让我们开始给我们的项目一些结构。在你项目的根目录下创建一个<i>src</i>目录，在<i>src</i>目录下创建一个<i>components</i>目录。在<i>components</i>目录中创建一个文件<i>Main.jsx</i>，内容如下。

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
 接下来，让我们在<i>App</i>文件中使用<em>Main</em>组件，该文件位于我们项目的根目录下的<i>App.js</i>。将该文件的当前内容替换成这样。

```javascript
import Main from './src/components/Main';

const App = () => {
  return <Main />;
};

export default App;
```

### Manually reloading the application

<!-- As we have seen, Expo will automatically reload the application when we make changes to the code. However, there might be times when automatic reload isn't working and the application has to be reloaded manually. This can be achieved through the in-app developer menu.-->
 正如我们所见，当我们对代码进行修改时，Expo会自动重新加载应用。然而，有时自动重载可能不起作用，必须手动重载应用。这可以通过应用内的开发者菜单来实现。

<!-- You can access the developer menu by shaking your device or by selecting "Shake Gesture" inside the Hardware menu in the iOS Simulator. You can also use the <em>⌘D</em> keyboard shortcut when your app is running in the iOS Simulator, or <em>⌘M</em> when running in an Android emulator on Mac OS and <em>Ctrl+M</em> on Windows and Linux.-->
 你可以通过摇动你的设备或在iOS模拟器中选择硬件菜单内的 "摇动手势 "来访问开发者菜单。当你的应用在iOS模拟器中运行时，你也可以使用<em>⌘D</em>键盘快捷键，或在Mac OS上的Android模拟器中运行时使用<em>⌘M</em>，在Windows和Linux上使用<em>Ctrl+M</em>。

<!-- Once the developer menu is open, simply press "Reload" to reload the application. After the application has been reloaded, automatic reloads should work without the need for a manual reload.-->
一旦开发者菜单打开，只需按下 "重新加载 "就可以重新加载应用。在应用被重新加载后，自动重新加载应该可以工作，而不需要手动重新加载。

</div>

<div class="tasks">

### Exercise 10.3.

#### Exercise 10.3: the reviewed repositories list

<!-- In this exercise, we will implement the first version of the reviewed repositories list. The list should contain the repository's full name, description, language, number of forks, number of stars, rating average and number of reviews. Luckily React Native provides a handy component for displaying a list of data, which is the [FlatList](https://reactnative.dev/docs/flatlist) component.-->
 在这个练习中，我们将实现第一个版本的已审查的软件库列表。列表应该包含版本库的全名、描述、语言、分叉数、星级数、平均评分和评论数。幸运的是React Native提供了一个显示数据列表的便捷组件，这就是[FlatList](https://reactnative.dev/docs/flatlist)组件。

<!-- Implement components <em>RepositoryList</em> and <em>RepositoryItem</em> in the <i>components</i> directory's files <i>RepositoryList.jsx</i> and <i>RepositoryItem.jsx</i>. The <em>RepositoryList</em> component should render the <em>FlatList</em> component and <em>RepositoryItem</em> a single item on the list (hint: use the <em>FlatList</em> component's [renderItem](https://reactnative.dev/docs/flatlist#required-renderitem) prop). Use this as the basis for the <i>RepositoryList.jsx</i> file:-->
 实现组件<em>RepositoryList</em>和<em>RepositoryItem</em>在<i>components</i>目录'的文件<i>RepositoryList.jsx</i>和<i>RepositoryItem.jsx</i>。<em>RepositoryList</em>组件应该渲染<em>FlatList</em>组件和<em>RepositoryItem</em>列表中的单个项目（提示：使用<em>FlatList</em>组件的[renderItem](https://reactnative.dev/docs/flatlist#required-renderitem)prop）。用这个作为<i>RepositoryList.jsx</i>文件的基础。

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

<!-- Now that we have a basic understanding of how core components work and we can use them to build a simple user interface it is time to add some style. In [part 2](/en/part2/adding_styles_to_react_app) we learned that in the browser environment we can define React component's style properties using CSS. We had an option to either define these styles inline using the <em>style</em> prop or in a CSS file with a suitable selector.-->
 现在我们对核心组件的工作原理有了基本的了解，我们可以用它们来构建一个简单的用户界面，是时候添加一些样式了。在[第二章节](/en/part2/adding_styles_to_react_app)中，我们了解到在浏览器环境中我们可以使用CSS定义React组件的样式属性。我们可以选择使用<em>style</em>prop内联定义这些样式，或者在CSS文件中使用合适的选择器来定义。

<!-- There are many similarities in the way style properties are attached to React Native's core components and the way they are attached to DOM elements. In React Native most of the core components accept a prop called <em>style</em>. The <em>style</em> prop accepts an object with style properties and their values. These style properties are in most cases the same as in CSS, however, property names are in <i>camelCase</i>. This means that CSS properties such as <em>padding-top</em> and <em>font-size</em> are written as <em>paddingTop</em> and <em>fontSize</em>. Here is a simple example of how to use the <em>style</em> prop:-->
 样式属性附加到React Native's核心组件的方式和附加到DOM元素的方式有很多相似之处。在React Native中，大多数的核心组件都接受一个名为<em>style</em>的prop。<em>style</em>prop接受一个带有样式属性及其值的对象。这些样式属性在大多数情况下与CSS相同，但是，属性名称采用<i>camelCase</i>。这意味着CSS属性如<em>padding-top</em>和<em>font-size</em>被写成<em>paddingTop</em>和<em>fontSize</em>。下面是一个关于如何使用<em>style</em>prop的简单例子。

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

<!-- On top of the property names, you might have noticed another difference in the example. In CSS numerical property values commonly have a unit such as <i>px</i>, <i>%</i>, <i>em</i> or <i>rem</i>. In React Native all dimension related property values such as <em>width</em>, <em>height</em>, <em>padding</em>, and <em>margin</em> as well as font sizes are <i>unitless</i>. These unitless numeric values represent <i>density-independent pixels</i>. In case you are wondering what are the available style properties for certain core component, check the [React Native Styling Cheat Sheet](https://github.com/vhpoet/react-native-styling-cheat-sheet).-->
 在属性名称的基础上，你可能已经注意到这个例子中的另一个不同之处。在CSS中，数字属性值通常有一个单位，如<i>px</i>, <i>%</i>, <i>em</i>或<i>rem</i>。在React Native中，所有与尺寸有关的属性值，如<em>width</em>, <em>height</em>, <em>padding</em>, and <em>margin</em>以及字体大小都是<i>无单位</i>。这些无单位的数值代表<i>与强度无关的像素</i>。如果你想知道某些核心组件的可用样式属性是什么，请查看[React Native Styling Cheat Sheet](https://github.com/vhpoet/react-native-styling-cheat-sheet)。

<!-- In general, defining styles directly in the <em>style</em> prop is not considered such a great idea, because it makes components bloated and unclear. Instead, we should define styles outside the component's render function using the [StyleSheet.create](https://reactnative.dev/docs/stylesheet#create) method. The <em>StyleSheet.create</em> method accepts a single argument which is an object consisting of named style objects and it creates a StyleSheet style reference from the given object. Here is an example of how to refactor the previous example using the <em>StyleSheet.create</em> method:-->
 一般来说，直接在<em>style</em>prop中定义样式被认为不是一个好主意，因为它使组件变得臃肿和不清晰。相反，我们应该使用[StyleSheet.create](https://reactnative.dev/docs/stylesheet#create)方法在组件的渲染函数之外定义样式。<em>StyleSheet.create</em>方法接受一个单一的参数，它是一个由命名的样式对象组成的对象，它从给定的对象中创建一个StyleSheet样式引用。下面是一个使用<em>StyleSheet.create</em>方法重构前一个例子的例子。

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

<!-- We create two named style objects, <em>styles.container</em> and <em>styles.text</em>. Inside the component, we can access specific style object the same way we would access any key in a plain object.-->
 我们创建了两个命名的样式对象，<em>styles.container</em>和<em>styles.text</em>。在组件内部，我们可以像访问普通对象中的任何键一样，访问特定的样式对象。

<!-- In addition to an object, the <em>style</em> prop also accepts an array of objects. In the case of an array, the objects are merged from left to right so that latter style properties take precedence. This works recursively, so we can have for example an array containing an array of styles and so forth. If an array contains values that evaluate to false, such as <em>null</em> or <em>undefined</em>, these values are ignored. This makes it easy to define <i>conditional styles</i> for example, based on the value of a prop. Here is an example of conditional styles:-->
 除了一个对象，<em>style</em>prop还接受一个对象的数组。在数组的情况下，对象从左到右被合并，这样后一个样式属性就会被优先考虑。这样做是递归的，所以我们可以有一个数组，其中包含一个样式数组，如此类推。如果一个数组包含计算为错误的值，如<em>null</em>或<em>undefined</em>，这些值将被忽略。这使得定义<i>条件样式</i>很容易，例如，基于一个prop的值。下面是一个条件性样式的例子。

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

<!-- In the example we use the <em>&&</em> operator with statement <em>condition && exprIfTrue</em>. This statement yields <em>exprIfTrue</em> if the <em>condition</em> evaluates to true, otherwise it will yield <em>condition</em>, which in that case is a value that evaluates to false. This is an extremely widely used and handy shorthand. Another option would be to use for example the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), <em>condition ? exprIfTrue : exprIfFalse</em>.-->
 在这个例子中，我们使用<em>&&</em>操作符，语句为<em>condition && exprIfTrue</em>。如果<em>condition</em>计算为真，这个语句就会产生<em>exprIfTrue</em>，否则就会产生<em>condition</em>，在这种情况下是一个计算为假的值。这是一个使用极为广泛和方便的速记方法。另一个选择是使用例如[条件运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)，<em>condition ? exprIfTrue : exprIfFalse</em>。

### Consistent user interface with theming

<!-- Let's stick with the concept of styling but with a bit wider perspective. Most of us have used a multitude of different applications and might agree that one trait that makes a good user interface is <i>consistency</i>. This means that the appearance of user interface components such as their font size, font family and color follows a consistent pattern. To achieve this we have to somehow <i>parametrize</i> the values of different style properties. This method is commonly known as <i>theming</i>.-->
 让我们坚持风格化的概念，但要有更广泛的视角。我们中的大多数人都使用过许多不同的应用，并可能同意，使一个好的用户界面的一个特征是<i>一致性</i>。这意味着用户界面组件的外观，如其字体大小、字体家族和颜色都遵循一个一致的模式。为了实现这一点，我们必须以某种方式<i>参数化</i>不同样式属性的值。这种方法通常被称为<i>主题化</i>。

<!-- Users of popular user interface libraries such as [Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/theming/) and [Material UI](https://material-ui.com/customization/theming/) might already be quite familiar with theming. Even though the theming implementations differ, the main idea is always to use variables such as <em>colors.primary</em> instead of ["magic numbers"](<https://en.wikipedia.org/wiki/Magic_number_(programming)>) such as <em>#0366d6</em> when defining styles. This leads to increased consistency and flexibility.-->
 流行的用户界面库如[Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/theming/)和[Material UI](https://material-ui.com/customization/theming/)的用户可能已经对主题化相当熟悉。尽管主题化的实现方式不同，但主要的想法是在定义样式时总是使用诸如<em>colors.primary</em>之类的变量，而不是诸如<em>#0366d6</em>之类的["神奇数字"](<https://en.wikipedia.org/wiki/Magic_number_(programming)>)。这导致了一致性和灵活性的提高。

<!-- Let's see how theming could work in practice in our application. We will be using a lot of text with different variations, such as different font sizes and colors. Because React Native does not support global styles, we should create our own <em>Text</em> component to keep the textual content consistent. Let's get started by adding the following theme configuration object in a <i>theme.js</i> file in the <i>src</i> directory:-->
 让我们看看主题化在我们的应用中是如何实际运作的。我们将使用大量具有不同变化的文本，例如不同的字体大小和颜色。因为React Native不支持全局样式，我们应该创建自己的<em>Text</em>组件来保持文本内容的一致性。让我们开始吧，在<i>src</i>目录下的<i>theme.js</i>文件中添加以下主题配置对象。

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
 接下来，我们应该创建实际的<em>Text</em>组件，使用这个主题配置。在我们已经有其他组件的<i>components</i>目录中创建一个<i>Text.jsx</i>文件。在<i>Text.jsx</i>文件中添加以下内容。

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

<!-- Now we have implemented our own text component with consistent color, font size and font weight variants which we can use anywhere in our application. We can get different text variations using different props like this:-->
 现在我们已经实现了自己的文本组件，具有一致的颜色、字体大小和字体重量的变体，我们可以在应用的任何地方使用。我们可以像这样使用不同的prop获得不同的文本变化。

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
 如果你喜欢，可以自由地扩展或修改这个组件。创建可重复使用的文本组件，如使用<em>Subheading</em>组件的<em>Text</em>，可能也是一个好主意。另外，随着你的应用的进展，不断地扩展和修改主题配置。

### Using flexbox for layout

<!-- The last concept we will cover related to styling is implementing layouts with [flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox). Those who are more familiar with CSS know that flexbox is not related only to React Native, it has many use cases in web development as well. In fact, those who know how flexbox works in web development won't probably learn that much from this section. Nevertheless, let's learn or revise the basics of flexbox.-->
 我们要讲的最后一个与造型有关的概念是用[flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)实现布局。那些对CSS比较熟悉的人知道，flexbox不仅与React Native有关，它在Web开发中也有很多用例。事实上，那些知道flexbox在web开发中如何工作的人可能不会从这一节中学到那么多。不过，让我们来学习或复习一下Flexbox的基础知识。

<!-- Flexbox is a layout entity consisting of two separate components: a <i>flex container</i> and inside it a set of <i>flex items</i>. Flex container has a set of properties that control the flow of its items. To make a component a flex container it must have the style property <em>display</em> set as <em>flex</em> which is the default value for the <em>display</em> property. Here is an example of a flex container:-->
 Flexbox是一个由两个独立组件组成的布局实体：一个<i>flex container</i>和里面的一组<i>flex items</i>。Flex容器有一组属性来控制其项目的流动。要使一个组件成为柔性容器，它必须将样式属性<em>display</em>设置为<em>flex</em>，这是<em>display</em>属性的默认值。下面是一个柔性容器的例子。

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
 也许柔性容器最重要的属性是以下这些。

<!-- - [flexDirection](https://css-tricks.com/almanac/properties/f/flex-direction/) property controls the direction in which the flex items are laid out within the container. Possible values for this property are <em>row</em>, <em>row-reverse</em>, <em>column</em> (default value) and <em>column-reverse</em>. Flex direction <em>row</em> will lay out the flex items from left to right, whereas <em>column</em> from top to bottom. <em>\*-reverse</em> directions will just reverse the order of the flex items.-->
 - [flexDirection](https://css-tricks.com/almanac/properties/f/flex-direction/)属性控制柔性项目在容器中的布局方向。这个属性的可能值是<em>row</em>, <em>row-reverse</em>, <em>column</em>（默认值）和<em>column-reverse</em>。弹性方向<em>row</em>将从左到右排列弹性项目，而<em>column</em>从上到下。<em>\*-reverse</em>方向将只是颠倒柔性项目的顺序。

<!-- - [justifyContent](https://css-tricks.com/almanac/properties/j/justify-content/) property controls the alignment of flex items along the main axis (defined by the <em>flexDirection</em> property). Possible values for this property are <em>flex-start</em> (default value), <em>flex-end</em>, <em>center</em>, <em>space-between</em>, <em>space-around</em> and <em>space-evenly</em>.-->
 - [justifyContent](https://css-tricks.com/almanac/properties/j/justify-content/)属性控制柔性项目沿主轴（由<em>flexDirection</em>属性定义）的对齐。这个属性的可能值是<em>flex-start</em>（默认值），<em>flex-end</em>，<em>center</em>，<em>space-between</em>，<em>space-around</em>和<em>space-evenly</em>。
<!-- - [alignItems](https://css-tricks.com/almanac/properties/a/align-items/) property does the same as <em>justifyContent</em> but for the opposite axis. Possible values for this property are <em>flex-start</em>, <em>flex-end</em>, <em>center</em>, <em>baseline</em> and <em>stretch</em> (default value).-->
 - [alignItems](https://css-tricks.com/almanac/properties/a/align-items/) 属性的作用与<em>justifyContent</em>相同，但用于相反的轴。这个属性的可能值是<em>flex-start</em>, <em>flex-end</em>, <em>center</em>, <em>baseline</em> 和 <em>stretch</em>（默认值）。

<!-- Let's move on to flex items. As mentioned, a flex container can contain one or many flex items. Flex items have properties that control how they behave in respect of other flex items in the same flex container. To make a component a flex item all you have to do is to set it as an immediate child of a flex container:-->
 让我们继续讨论柔性项目。如前所述，一个柔性容器可以包含一个或多个柔性项目。挠性项目有一些属性，控制它们在同一挠性容器中对其他挠性项目的行为。要使一个组件成为灵活项目，你所要做的就是把它设置为一个灵活容器的直接子项。

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

<!-- One of the most commonly used properties of flex item is the [flexGrow](https://css-tricks.com/almanac/properties/f/flex-grow/) property. It accepts a unitless value which defines the ability for a flex item to grow if necessary. If all flex items have a <em>flexGrow</em> of <em>1</em>, they will share all the available space evenly. If a flex item has a <em>flexGrow</em> of <em>0</em>, it will only use the space its content requires and leave the rest of the space for other flex items.-->
 灵活性项目最常用的属性之一是[flexGrow](https://css-tricks.com/almanac/properties/f/flex-grow/) 属性。它接受一个无单位的值，该值定义了在必要的情况下，一个flex项目的增长能力。如果所有灵活项的<em>flexGrow</em>都是<em>1</em>，它们将均匀地分享所有可用空间。如果一个弹性项目的<em>flexGrow</em>为<em>0</em>，它将只使用其内容所需的空间，而将剩余的空间留给其他弹性项目。

<!-- Here is a more interactive and concrete example of how to use flexbox to implement a simple card component with header, body and footer: [Flexbox example](https://snack.expo.io/@kalleilv/3d045d).-->
 这里有一个更加互动和具体的例子，说明如何使用flexbox来实现一个具有页眉、页身和页脚的简单卡片组件：[Flexbox例子](https://snack.expo.io/@kalleilv/3d045d)。

<!-- Next, read the article [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) which has comprehensive visual examples of flexbox. It is also a good idea to play around with the flexbox properties in the [Flexbox Playground](https://flexbox.tech/) to see how different flexbox properties affect the layout. Remember that in React Native the property names are the same as the ones in CSS except for the <i>camelCase</i> naming. However, the <i>property values</i> such as <em>flex-start</em> and <em>space-between</em> are exactly the same.-->
 接下来，请阅读[Flexbox完全指南](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)这篇文章，其中有全面的flexbox的视觉例子。在[Flexbox Playground](https://flexbox.tech/)中玩玩Flexbox属性也是一个好主意，看看不同的Flexbox属性是如何影响布局的。请记住，在React Native中，除了<i>camelCase</i>命名外，属性名称与CSS中的属性名称是一样的。然而，<i>属性值</i>，如<em>flex-start</em>和<em>space-between</em>是完全一样的。

<!-- **NB:** React Native and CSS has some differences regarding the flexbox. The most important difference is that in React Native the default value for the <em>flexDirection</em> property is <em>column</em>. It is also worth noting that the <em>flex</em> shorthand doesn't accept multiple values in React Native. More on the React Native's flexbox implementation can be read in the [documentation](https://reactnative.dev/docs/flexbox).-->
 **NB:** React Native和CSS在flexbox方面有一些区别。最重要的区别是，在React Native中，<em>flexDirection</em>属性的默认值是<em>column</em>。同样值得注意的是，<em>flex</em>速记在React Native中不接受多个值。更多关于React Native's flexbox的实现可以在[文档](https://reactnative.dev/docs/flexbox)中阅读。

</div>

<div class="tasks">

### Exercises 10.4. - 10.5.

#### Exercise 10.4: the app bar

<!-- We will soon need to navigate between different views in our application. That is why we need an [app bar](https://material.io/components/app-bars-top/) to display tabs for switching between different views. Create a file <i>AppBar.jsx</i> in the <i>components</i> folder with the following content:-->
 我们很快就会需要在我们的应用中的不同视图之间进行导航。这就是为什么我们需要一个[app bar](https://material.io/components/app-bars-top/)来显示标签，以便在不同的视图之间切换。在<i>components</i>文件夹中创建一个文件<i>AppBar.jsx</i>，内容如下。

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

<!-- Now that the <em>AppBar</em> component will prevent the status bar from overlapping the content, you can remove the <em>marginTop</em> style we added for the <em>Main</em> component earlier in the <i>Main.jsx</i> file. The <em>AppBar</em> component should currently contain a tab with text "Repositories". Make the tab pressable by using the [Pressable](https://reactnative.dev/docs/pressable) component but you don't have to handle the <em>onPress</em> event in any way. Add the <em>AppBar</em> component to the <em>Main</em> component so that it is the uppermost component in the screen. The <em>AppBar</em> component should look something like this:-->
 现在，<em>AppBar</em>组件将防止状态栏与内容重叠，你可以删除我们先前在<i>Main.jsx</i>文件中为<em>Main</em>组件添加的<em>marginTop</em>样式。<em>AppBar</em>组件目前应该包含一个文本为 "Repositories "的标签。通过使用[Pressable](https://reactnative.dev/docs/pressable)组件使标签可被按下，但你不需要以任何方式处理<em>onPress</em>事件。将<em>AppBar</em>组件添加到<em>Main</em>组件中，使其成为屏幕中最上面的组件。<em>AppBar</em>组件应该如下所示：

![Application preview](../../images/10/6.jpg)

<!-- The background color of the app bar in the image is <em>#24292e</em> but you can use any other color as well. It might be a good idea to add the app bar's background color into the theme configuration so that it is easy to change it if needed. Another good idea might be to separate the app bar's tab into its own component such as <em>AppBarTab</em> so that it is easy to add new tabs in the future.-->
 图片中应用栏的背景颜色是<em>#24292e</em>，但你也可以使用任何其他颜色。把应用栏的背景颜色添加到主题配置中可能是一个好主意，这样在需要时就可以很容易地改变它。另一个好主意是将应用栏的标签分离成自己的组件，如<em>AppBarTab</em>，这样将来就很容易添加新的标签。

#### Exercise 10.5: polished reviewed repositories list

<!-- The current version of the reviewed repositories list looks quite grim. Modify the <i>RepositoryItem</i> component so that it also displays the repository author's avatar image. You can implement this by using the [Image](https://reactnative.dev/docs/image) component. Counts, such as number of stars and forks, larger than or equal to 1000 should be displayed in thousands with precision of one decimal and with a "k" suffix. This means that for example fork count of 8439 should be displayed as "8.4k". Also polish the overall look of the component so that the reviewed repositories list looks something like this:-->
 当前版本的审查库列表看起来相当黯淡。修改<i>RepositoryItem</i>组件，使其同时显示版本库作者的头像。你可以通过使用[Image](https://reactnative.dev/docs/image)组件来实现这一点。大于或等于1000的数字，如星星和叉子的数量，应该以千位数显示，精度为小数点后一位，并加上 "k "的后缀。这意味着，例如8439的叉子数应该显示为 "8.4k"。此外，还要对该组件的整体外观进行修饰，使审查过的软件库列表如下所示：

![Application preview](../../images/10/7.jpg)

<!-- In the image, the <em>Main</em> component's background color is set to <em>#e1e4e8</em> whereas <em>RepositoryItem</em> component's background color is set to <em>white</em>. The language tag's background color is <em>#0366d6</em> which is the value of the <em>colors.primary</em> variable in the theme configuration. Remember to exploit the <em>Text</em> component we implemented earlier. Also when needed, split the <em>RepositoryItem</em> component into smaller components.-->
 在图片中，<em>Main</em>组件的背景颜色被设置为<em>#e1e4e8</em>而<em>RepositoryItem</em>组件的背景颜色被设置为<em>white</em>。语言标签的背景色是<em>#0366d6</em>，这是主题配置中<em>colors.primary</em>的变量值。记住要利用我们之前实现的<em>Text</em>组件。同样在需要的时候，把<em>RepositoryItem</em>组件拆成小的组件。

</div>

<div class="content">

### Routing

<!-- When we start to expand our application we will need a way to transition between different views such as the repositories view and the sign in view. In [part 7](/en/part7/react_router) we got familiar with [React router](https://reactrouter.com/) library and learned how to use it to implement routing in a web application.-->
 当我们开始扩展我们的应用时，我们将需要一种方法在不同的视图之间转换，如存储库视图和签到视图。在[第7章节](/en/part7/react_router)中，我们熟悉了[React router](https://reactrouter.com/)库，并学会了如何使用它来实现Web应用中的路由。

<!-- Routing in a React Native application is a bit different to routing in a web application. The main difference is that we can't reference pages with URLs, which we type in to the browser's address bar, and can't navigate back and forth through user's history using the browsers [history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API). However, this is just the matter of the router interface we are using.-->
 在React Native应用中的路由与Web应用中的路由有些不同。主要的区别是，我们不能用URL来引用页面，我们在浏览器的地址栏里输入URL，也不能用浏览器的[历史API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)来回浏览用户的历史。然而，这只是我们所使用的路由器接口的问题。

<!-- With React Native we can use the entire React router's core, including the hooks and components. The only difference to the browser environment is that we must replace the <em>BrowserRouter</em> with React Native compatible [NativeRouter](https://reactrouter.com/en/main/router-components/native-router), provided by the [react-router-native](https://www.npmjs.com/package/react-router-native) library. Let's get started by installing the <i>react-router-native</i> library:-->
 使用React Native，我们可以使用整个React路由器的核心，包括钩子和组件。与浏览器环境的唯一区别是，我们必须用React Native兼容的[NativeRouter](https://reactrouter.com/en/main/router-components/native-router)取代<em>BrowserRouter</em>，该库由[react-router-native](https://www.npmjs.com/package/react-router-native)提供。让我们从安装<i>react-router-native</i>库开始。

```shell
npm install react-router-native
```

<!-- Next, open the <i>App.js</i> file and add the <em>NativeRouter</em> component to the <em>App</em> component:-->
 接下来，打开<i>App.js</i>文件，将<em>NativeRouter</em>组件添加到<em>App</em>组件。

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
 一旦路由器就位，让我们在<i>Main.jsx</i>文件中的<me>Main</em>组件上添加我们的第一个路由。

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

<!-- That's it! The last <em>Route</em> inside the <em>Routes</em> is for catching paths that don't match any previously defined path. In this case we want to navigate to the home view.-->
 就是这样!<em>Routes</em>里面的最后一个<em>Route</em>是用来捕捉与之前定义的路径不匹配的路径。在这种情况下，我们想导航到主视图。

</div>

<div class="tasks">

### Exercises 10.6. - 10.7.

#### Exercise 10.6: the sign in view

<!-- We will soon implement a form, which a user can use to <i>sign in</i> to our application. Before that, we must implement a view that can be accessed from the app bar. Create a file <i>SignIn.jsx</i> in the <i>components</i> directory with the following content:-->
 我们将很快实现一个表单，用户可以用它来<i>登录</i>我们的应用。在此之前，我们必须实现一个可以从应用栏中访问的视图。在<i>components</i>目录下创建一个文件<i>SignIn.jsx</i>，内容如下。

```javascript
import Text from './Text';

const SignIn = () => {
  return <Text>The sign in view</Text>;
};

export default SignIn;
```

<!-- Set up a route for this <em>SignIn</em> component in the <em>Main</em> component. Also add a tab with text "Sign in" in to the app bar next to the "Repositories" tab. Users should be able to navigate between the two views by pressing the tabs (hint: you can use the React router's [Link](https://reactrouter.com/en/main/components/link-native) component).-->
 在<em>Main</em>组件中为这个<em>SignIn</em>组件设置一个路由。同时在应用栏中的 "存储库 "标签旁边添加一个带有 "登录 "文字的标签。用户应该能够通过按下标签在两个视图之间导航（提示：你可以使用React路由器's [Link](https://reactrouter.com/en/main/components/link-native) 组件）。

#### Exercise 10.7: scrollable app bar

<!-- As we are adding more tabs to our app bar, it is a good idea to allow horizontal scrolling once the tabs won't fit the screen. The [ScrollView](https://reactnative.dev/docs/scrollview) component is just the right component for the job.-->
 由于我们要在应用栏中添加更多的标签，一旦标签不能适应屏幕，允许水平滚动是个好主意。[ScrollView](https://reactnative.dev/docs/scrollview)组件恰恰是完成这项工作的合适组件。

<!-- Wrap the tabs in the <em>AppBar</em> component's tabs with a <em>ScrollView</em> component:-->
用一个<em>ScrollView</em>组件来包裹<em>AppBar</em>组件的标签。

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
 设置[horizontal](https://reactnative.dev/docs/scrollview#horizontal)prop<em>true</em>将使<em>ScrollView</em>组件在内容无法适应屏幕时水平滚动。注意，你需要给<em>ScrollView</em>组件添加合适的样式属性，这样标签就会以<i>行</i>的形式放置在flex容器内。你可以通过添加标签来确保应用栏可以水平滚动，直到最后一个标签无法适应屏幕。只要记得在应用栏如期工作后删除多余的标签。

</div>

<div class="content">

### Form state management

<!-- Now that we have a placeholder for the sign in view the next step would be to implement the sign in form. Before we get to that let's talk about forms in a more wider perspective.-->
 现在我们有一个签到视图的占位符，下一步是实现签到表格。在这之前，让我们从更广泛的角度来讨论表单。

<!-- Implementation of forms relies heavily on the state management. Using the React's <em>useState</em> hook for the state management might get the job done for smaller forms. However, it will quickly make the state management quite tedious with more complex forms. Luckily there are many good libraries in the React ecosystem that ease the state management of forms. One of these libraries is [Formik](https://jaredpalmer.com/formik/).-->
 表单的实现在很大程度上依赖于状态管理。使用React的<em>useState</em>钩子来进行状态管理可能会完成较小的表单的工作。然而，对于更复杂的表单，它将很快使状态管理变得相当乏味。幸运的是，在React生态系统中，有许多好的库可以缓解表单的状态管理问题。其中一个库是[Formik](https://jaredpalmer.com/formik/)。

<!-- The main concepts of Formik are the <i>context</i> and a <i>field</i>. The Formik's context is provided by the [Formik](https://jaredpalmer.com/formik/docs/api/formik) component that contains the form's state. The state consists of information of form's fields. This information includes for example the value and validation errors of each field. State's fields can be referenced by their name using the [useField](https://jaredpalmer.com/formik/docs/api/useField) hook or the [Field](https://jaredpalmer.com/formik/docs/api/field) component.-->
 Formik的主要概念是<i>context</i>和<i>field</i>。Formik's context由[Formik](https://jaredpalmer.com/formik/docs/api/formik)组件提供，它包含表单的状态。状态由表单字段的信息组成。这些信息包括例如每个字段的值和验证错误。状态的字段可以通过使用[useField](https://jaredpalmer.com/formik/docs/api/useField)钩子或[Field](https://jaredpalmer.com/formik/docs/api/field)组件的名称来引用。

<!-- Let's see how this actually works by creating a form for calculating the [body mass index](https://en.wikipedia.org/wiki/Body_mass_index):-->
 让我们通过创建一个计算[身体质量指数](https://en.wikipedia.org/wiki/Body_mass_index)的表单来看看它的实际效果。

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

<!-- This example is not part of our application, so you don't need to actually add this code to the application. You can however try it out for example in [Expo Snack](https://snack.expo.io/). Expo Snack is an online editor for React Native, similar to [JSFiddle](https://jsfiddle.net/) and [CodePen](https://codepen.io/). It is a useful platform for quickly trying out code. You can share Expo Snacks with others using a link or embedding them as a <i>Snack Player</i> in a web site. You might have bumped into Snack Players for example in this material and React Native documentation.-->
 这个例子不是我们应用的一部分，所以你不需要把这个代码添加到应用中。然而，你可以在[Expo Snack](https://snack.expo.io/)中尝试一下这个例子。Expo Snack是一个React Native的在线编辑器，类似于[JSFiddle](https://jsfiddle.net/)和[CodePen](https://codepen.io/)。它是一个快速尝试代码的有用平台。你可以使用链接与他人分享Expo Snacks，或者将它们作为<i>Snack Player</i>嵌入到网站中。你可能在这个材料和React Native文档中撞见了Snack Player的例子。

<!-- In the example, we define the <em>Formik</em> context in the <em>BodyMassIndexCalculator</em> component and provide it with initial values and a submit callback. Initial values are provided through the [initialValues](https://jaredpalmer.com/formik/docs/api/formik#initialvalues-values) prop as an object with field names as keys and the corresponding initial values as values. The submit callback is provided through the [onSubmit](https://jaredpalmer.com/formik/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany) prop and it is called when the <em>handleSubmit</em> function is called, with the condition that there isn't any validation errors. Children of the <em>Formik</em> component is a function which is called with [props](https://jaredpalmer.com/formik/docs/api/formik#formik-render-methods-and-props) including state related information and actions such as the <em>handleSubmit</em> function.-->
 在这个例子中，我们在<em>BodyMassIndexCalculator</em>组件中定义了<em>Formik</em>上下文，并为它提供了初始值和一个提交回调。初始值是通过[initialValues](https://jaredpalmer.com/formik/docs/api/formik#initialvalues-values)prop提供的，是一个以字段名为键、以相应的初始值为值的对象。提交回调是通过[onSubmit](https://jaredpalmer.com/formik/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany)prop提供的，它在<em>handleSubmit</em>函数被调用时被调用，条件是没有任何验证错误。<em>Formik</em>组件的子女是一个函数，它被调用的[props](https://jaredpalmer.com/formik/docs/api/formik#formik-render-methods-and-props)包括与状态有关的信息和行动，如<em>handleSubmit</em>函数。

<!-- The <em>BodyMassIndexForm</em> component contains the state bindings between the context and text inputs. We use the [useField](https://jaredpalmer.com/formik/docs/api/useField) hook to get the value of a field and to change it. _useField_ hooks has one argument which is the name of the field and it returns an array with three values, <em>[field, meta, helpers]</em>. The [field object](https://jaredpalmer.com/formik/docs/api/useField#fieldinputpropsvalue) contains the value of the field, the [meta object](https://jaredpalmer.com/formik/docs/api/useField#fieldmetapropsvalue) contains field meta information such as a possible error message and the [helpers object](https://jaredpalmer.com/formik/docs/api/useField#fieldhelperprops) contains different actions for changing the state of field such as the <em>setValue</em> function. Note that the component that uses the <em>useField</em> hook has to be _within the Formik's context_. This means that the component has to be a descendant of the <em>Formik</em> component.-->
 <em>BodyMassIndexForm</em>组件包含上下文和文本输入之间的状态绑定。我们使用[useField](https://jaredpalmer.com/formik/docs/api/useField)钩子来获取一个字段的值并改变它。_useField_钩子有一个参数，是字段的名称，它返回一个有三个值的数组，<em>[field, meta, helpers]</em>。[字段对象](https://jaredpalmer.com/formik/docs/api/useField#fieldinputpropsvalue)包含字段的值，[元对象](https://jaredpalmer.com/formik/docs/api/useField#fieldmetapropsvalue)包含字段的元信息，如可能的错误信息，[帮助者对象](https://jaredpalmer.com/formik/docs/api/useField#fieldhelperprops)包含改变字段状态的不同操作，如<em>setValue</em>函数。请注意，使用<em>useField</em>钩子的组件必须在Formik's context_之内。这意味着该组件必须是<em>Formik</em>组件的一个子嗣。

<!-- Here is an interactive version of our previous example: [Formik example](https://snack.expo.io/@kalleilv/formik-example).-->
 这里是我们之前例子的互动版本。[Formik例子](https://snack.expo.io/@kalleilv/formik-example)。

<!-- In the previous example using the <em>useField</em> hook with the <em>TextInput</em> component causes repetitive code. Let's extract this repetitive code into a <em>FormikTextInput</em> component and create a custom <em>TextInput</em> component to make text inputs a bit more visually pleasing. First, let's install Formik:-->
 在前面的例子中，使用<em>useField</em>钩子和<em>TextInput</em>组件会导致重复的代码。让我们把这些重复的代码提取到<em>FormikTextInput</em>组件中，并创建一个自定义的<em>TextInput</em>组件，使文本输入在视觉上更悦目。首先，让我们安装Formik。

```shell
npm install formik
```

<!-- Next, create a file <i>TextInput.jsx</i> in the <i>components</i> directory with the following content:-->
 接下来，在<i>components</i>目录下创建一个文件<i>TextInput.jsx</i>，内容如下。

```javascript
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [style];

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
```

<!-- Let's move on to the <em>FormikTextInput</em> component that adds the Formik's state bindings to the <em>TextInput</em> component. Create a file <i>FormikTextInput.jsx</i> in the <i>components</i> directory with the following content:-->
 让我们进入<em>FormikTextInput</em>组件，将Formik的状态绑定添加到<em>TextInput</em>组件。在<i>components</i>目录下创建一个文件<i>FormikTextInput.jsx</i>，内容如下。

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
 通过使用<em>FormikTextInput</em>组件，我们可以像这样重构前面例子中的<em>BodyMassIndexForm</em>组件。

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
 我们可以看到，实现处理<em>TextInput</em>组件的Formik绑定的<em>TextInput</em>组件可以节省大量的代码。如果你的Formik表单使用了其他的输入组件，为它们实现类似的抽象也是一个好主意。

</div>

<div class="tasks">


### Exercise 10.8.

#### Exercise 10.8: the sign in form

<!-- Implement a sign in form to the <em>SignIn</em> component we added earlier in the <i>SignIn.jsx</i> file. The sign in form should include two text fields, one for the username and one for the password. There should also be a button for submitting the form. You don't need to implement a <em>onSubmit</em> callback function, it is enough that the form values are logged using <em>console.log</em> when the form is submitted:-->
 为我们之前在<i>SignIn.jsx</i>文件中添加的<em>SignIn</em>组件实现一个登录表单。签到表格应该包括两个文本字段，一个是用户名，一个是密码。还应该有一个提交表单的按钮。你不需要实现一个<em>onSubmit</em>回调函数，只要在表单提交时使用<em>console.log</em>记录表单的值就足够了。

```javascript
const onSubmit = (values) => {
  console.log(values);
};
```

<!-- Remember to utilize the <em>FormikTextInput</em> component we implemented earlier. You can use the [secureTextEntry](https://reactnative.dev/docs/textinput#securetextentry) prop in the <em>TextInput</em> component to obscure the password input.-->
 记得利用我们之前实现的<em>FormikTextInput</em>组件。你可以使用<em>TextInput</em>组件中的[secureTextEntry](https://reactnative.dev/docs/textinput#securetextentry)prop来掩盖密码输入。

<!-- The sign in form should look something like this:-->
 签到表格看起来应该是这样的。

![Application preview](../../images/10/19.jpg)

</div>

<div class="content">

### Form validation

<!-- Formik offers two approaches to the form validation: a validation function or a validation schema. A validation function is a function provided for the <em>Formik</em> component as the value of the [validate](https://jaredpalmer.com/formik/docs/guides/validation#validate) prop. It receives the form's values as an argument and returns an object containing possible field specific error messages.-->
 Formik为表单验证提供了两种方法：一个验证函数或一个验证模式。一个验证函数是为<em>Formik</em>组件提供的一个函数，作为[validate](https://jaredpalmer.com/formik/docs/guides/validation#validate)prop的值。它接收表单的值作为一个参数，并返回一个包含可能的字段特定错误信息的对象。

<!-- The second approach is the validation schema which is provided for the <em>Formik</em> component as the value of the [validationSchema](https://jaredpalmer.com/formik/docs/guides/validation#validationschema) prop. This validation schema can be created with a validation library called [Yup](https://github.com/jquense/yup). Let's get started by installing Yup:-->
 第二种方法是验证模式，它作为[validationSchema](https://jaredpalmer.com/formik/docs/guides/validation#validationschema)prop的值提供给<em>Formik</em>组件。这个验证模式可以通过一个叫做[Yup](https://github.com/jquense/yup)的验证库来创建。让我们从安装Yup开始吧。

```shell
npm install yup
```

<!-- Next, as an example, let's create validation schema for the body mass index form we implemented earlier. We want to validate that both <i>mass</i> and <i>height</i> fields are present and they are numeric. Also the value of <i>mass</i> should be greater or equal to 1 and the value of <i>height</i> should be greater or equal to 0.5. Here is how we define the schema:-->
 接下来，作为一个例子，让我们为我们之前实现的体重指数表格创建验证模式。我们要验证<i>mass</i>和<i>height</i>这两个字段是否存在，并且是数字。另外，<i>mass</i>的值应该大于或等于1，<i>height</i>的值应该大于或等于0.5。下面是我们定义模式的方式。

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
 每次字段的值发生变化时，以及调用<em>handleSubmit</em>函数时，都会默认进行验证。如果验证失败，<em>Formik</em>组件的<em>onSubmit</em>prop所提供的函数不会被调用。

<!-- The <em>FormikTextInput</em> component we previously implemented displays field's error message if it is present and the field is "touched", meaning that the field has received and lost focus:-->
 我们之前实现的<em>FormikTextInput</em>组件会显示字段的错误信息，如果它存在并且字段被 "触摸"，意味着字段已经收到并失去焦点。

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

### Exercise 10.9.

#### Exercise 10.9: validating the sign in form

<!-- Validate the sign in form so that both username and password fields are required. Note that the <em>onSubmit</em> callback implemented in the previous exercise, <i>should not be called</i> if the form validation fails.-->
 验证签到表单，使用户名和密码字段都是必填的。请注意，在前面的练习中实现的<em>onSubmit</em>回调，<i>不应该被调用</i>如果表单验证失败。

<!-- The current implementation of the <em>FormikTextInput</em> component should display an error message if a touched field has an error. Emphasize this error message by giving it a red color.-->
 当前实现的<em>FormikTextInput</em>组件应该在触及的字段有错误时显示错误信息。通过给它一个红色的颜色来强调这个错误信息。

<!-- On top of the red error message, give an invalid field a visual indication of an error by giving it a red border color. Remember that if a field has an error, the <em>FormikTextInput</em> component sets the <em>TextInput</em> component's <em>error</em> prop as <em>true</em>. You can use the value of the <em>error</em> prop to attach conditional styles to the <em>TextInput</em> component.-->
 在红色的错误信息之上，通过给它一个红色的边框颜色，给一个无效的字段一个错误的视觉指示。记住，如果一个字段有错误，<em>FormikTextInput</em>组件将<em>TextInput</em>组件的<em>error</em>prop设置为<em>true</em>。你可以使用<em>error</em>prop的值来给<em>TextInput</em>组件附加条件样式。

<!-- Here's what the sign in form should roughly look like with an invalid field:-->
 下面是签到表单中的无效字段的大致情况。

![Application preview](../../images/10/8.jpg)

<!-- The red color used in this implementation is <em>#d73a4a</em>.-->
 这个实现中使用的红色是<em>#d73a4a</em>。

</div>

<div class="content">

### Platform specific code

<!-- A big benefit of React Native is that we don't need to worry about whether the application is run on a Android or iOS device. However, there might be cases where we need to execute <i>platform specific code</i>. Such case could be for example using a different implementation of a component on a different platform.-->
 React Native的一大好处是，我们不需要担心应用是否在Android或iOS设备上运行。然而，在某些情况下，我们可能需要执行<i>平台特定代码</i>。例如，这种情况可能是在不同的平台上使用一个组件的不同实现。

<!-- We can access the user's platform through the <em>Platform.OS</em> constant:-->
 我们可以通过<em>Platform.OS</em>常量来访问用户的平台。

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

<!-- Possible values for the <em>Platform.OS</em> constant are <em>android</em> and <em>ios</em>. Another useful way to define platform specific code branches is to use the <em>Platform.select</em> method. Given an object where keys are one of <em>ios</em>, <em>android</em>, <em>native</em> and <em>default</em>, the <em>Platform.select</em> method returns the most fitting value for the platform the user is currently running on. We can rewrite the <em>styles</em> variable in the previous example using the <em>Platform.select</em> method like this:-->
<em>Platform.OS</em>常量的可能值是<em>android</em>和<em>ios</em>。另一个定义平台特定代码分支的有用方法是使用<em>Platform.select</em>方法。给定一个对象，其键值为<em>ios</em>、<em>android</em>、<em>native</em>和<em>default</em>之一，<em>Platform.select</em>方法返回最适合用户当前运行平台的值。我们可以用<em>Platform.select</em>方法重写前面例子中的<em>styles</em>变量，就像这样。

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

<!-- We can even use the <em>Platform.select</em> method to require a platform specific component:-->
 我们甚至可以使用<em>Platform.select</em>方法来要求一个特定平台的组件。

```javascript
const MyComponent = Platform.select({
  ios: () => require('./MyIOSComponent'),
  android: () => require('./MyAndroidComponent'),
})();

<MyComponent />;
```

<!-- However, a more sophisticated method for implementing and importing platform specific components (or any other piece of code) is to use the <i>.ios.jsx</i> and <i>.android.jsx</i> file extensions. Note that the <i>.jsx</i> extension can as well be any extensions recognized by the bundler, such as <i>.js</i>. We can for example have files <i>Button.ios.jsx</i> and <i>Button.android.jsx</i> which we can import like this:-->
 然而，实现和导入平台特定组件（或任何其他代码）的更复杂的方法是使用<i>.ios.jsx</i>和<i>.android.jsx</i>文件扩展。请注意，<i>.jsx</i>扩展名也可以是捆绑器识别的任何扩展名，如<i>.js</i>。例如，我们可以有<i>Button.ios.jsx</i>和<i>Button.android.jsx</i>文件，我们可以像这样导入。

```javascript
import Button from './Button';

const PlatformSpecificButton = () => {
  return <Button />;
};
```

<!-- Now, the Android bundle of the application will have the component defined in the <i>Button.android.jsx</i> whereas the iOS bundle the one defined in the <i>Button.ios.jsx</i> file.-->
 现在，应用的Android捆绑包将拥有定义在<i>Button.android.jsx</i>中的组件，而iOS捆绑包则是定义在<i>Button.ios.jsx</i>文件中的。

</div>

<div class="tasks">

### Exercise 10.10.

#### Exercise 10.10: a platform specific font

<!-- Currently the font family of our application is set to <i>System</i> in the theme configuration located in the <i>theme.js</i> file. Instead of the <i>System</i> font, use a platform specific [Sans-serif](https://en.wikipedia.org/wiki/Sans-serif) font. In the Android platform use the <i>Roboto</i> font and in the iOS platform use the <i>Arial</i> font. The default font can be <i>System</i>.-->
 目前，在位于<i>theme.js</i>文件的主题配置中，我们应用的字体家族被设置为<i>System</i>。不使用<i>System</i>字体，而使用平台特定的[Sans-serif](https://en.wikipedia.org/wiki/Sans-serif)字体。在Android平台上使用<i>Roboto</i>字体，在iOS平台上使用<i>Arial</i>字体。默认字体可以是<i>System</i>。

<!-- This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Note that exercises in this section should be submitted to the part 2 in the exercise submission system.-->
 这是本节的最后一个练习。现在是时候把你的代码推送到GitHub，并把你所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020)。注意，本节的练习应该提交到练习提交系统中的第二章节。
</div>
